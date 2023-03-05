const async = require("async-q"),
  config = require("../../config"),
  colors = require("colors/safe"),
  kat = require("../../lib/kat"),
  util = require("../../util");
let helper, name;


/* Get all the movies competable with Popcorn Time. */
const getMovie = function*(katMovie) {
  const newMovie = yield util.spawn(helper.getTraktInfo(katMovie.slugYear));
  if (typeof(newMovie) != "undefined" && newMovie._id) {
    delete katMovie.movieTitle;
    delete katMovie.slug;
	delete katMovie.slugYear;
    delete katMovie.torrentLink;
    delete katMovie.quality;
	delete katMovie.year;

    return yield helper.addTorrents(newMovie, katMovie);
  }
};

/* Extract movie information based on a regex. */
const extractMovie = (torrent, regex) => {
  let movieTitle = torrent.title.match(regex)[1];
  if (movieTitle.endsWith(" ")) {
    movieTitle = movieTitle.substring(0, movieTitle.length - 1);
  }
  movieTitle = movieTitle.replace(/\./g, " ");
  let slug = movieTitle.replace(/\s+/g, "-").toLowerCase();
  slug = slug in config.katMap ? config.katMap[slug] : slug;
  const year = torrent.title.match(regex)[2];
  const quality = torrent.title.match(regex)[3];

  const movie = {
    movieTitle: movieTitle,
    slug: slug,
	slugYear: slug + "-" + year,
    torrentLink: torrent.link,
	year: year,
    quality: quality
  };

  movie[quality] = {
    url: torrent.magnet,
    seeds: torrent.seeds,
    peers: torrent.peers,
    provider: name
  };

  return movie;
};

/* Get movie info from a given torrent. */
const getMovieData = (torrent) => {
  const threeDimensions = /(.*).(\d{4}).[3Dd]\D+(\d{3,4}p)/;
  const fourKay = /(.*).(\d{4}).[4k]\D+(\d{3,4}p)/;
  const withYear = /(.*).(\d{4})\D+(\d{3,4}p)/;
  if (torrent.title.match(threeDimensions)) {
    return extractMovie(torrent, threeDimensions);
  } else if (torrent.title.match(fourKay)) {
    return extractMovie(torrent, fourKay);
  } else if (torrent.title.match(withYear)) {
    return extractMovie(torrent, withYear);
  } else {
    util.onError(name + ": Could not find data from torrent: '" + (config.colorOutput ? colors.cyan(torrent.title) : torrent.title) + "'");
  }
};

/* Puts all the found movies from the torrents in an array. */
const getAllKATMovies = (torrents) => {
  const movies = [];
  return async.mapSeries(torrents, (torrent) => {
    if (torrent) {
      const movie = getMovieData(torrent);
      if (movie) {
        if (movies.length != 0) {
          const matching = movies.filter((m) => {
            return m.movieTitle === movie.movieTitle && m.slug === movie.slug;
          });

          if (matching.length != 0) {
            const index = movies.indexOf(matching[0]);
            if (!matching[0][movie.quality]) {
              matching[0][movie.quality] = movie[movie.quality];
            }

            movies.splice(index, 1, matching[0]);
          } else {
            movies.push(movie);
          }
        } else {
          movies.push(movie);
        }
      }
    }
  }).then((value) => {
    return movies;
  });
};

/* Get all the torrents of a given provider. */
const getAllTorrents = (totalPages, provider) => {
  let katTorrents = [];
  return async.timesSeries(totalPages, (page) => {
    provider.query.page = page + 1;
    util.log(name + ": Starting searching kat on page " + (config.colorOutput ? colors.cyan(provider.query.page) : provider.query.page) + " of " + (config.colorOutput ? colors.cyan(totalPages) : totalPages));
    return kat.search(provider.query).then((result) => {
      katTorrents = katTorrents.concat(result.results);
    }).catch((err) => {
      util.onError(err);
      return err;
    });
  }).then((value) => {
    util.log(name + ": Found " + (config.colorOutput ? colors.cyan(katTorrents.length) : katTorrents.length) + " torrents.");
    return katTorrents;
  });
};

const KAT = (_name) => {

  name = _name;
  helper = require("./helper")(name);

  return {

    /* Returns a list of all the inserted torrents. */
    search: function*(provider) {
      util.log(name + ": Starting scraping...");
      provider.query.page = 1;
      provider.query.category = "movies";
      provider.query.verified = 1;
      provider.query.adult_filter = 1;
	  provider.query.language = "en";

      const getTotalPages = yield kat.search(provider.query);
      const totalPages = getTotalPages.totalPages;
      util.log(name + ": Total pages " + (config.colorOutput ? colors.cyan(totalPages) : totalPages));

      const katTorrents = yield getAllTorrents(totalPages, provider);
      const katMovies = yield getAllKATMovies(katTorrents);
      return yield async.mapLimit(katMovies, config.maxWebRequest, (katMovie) => {
        return util.spawn(getMovie(katMovie)).catch((err) => {
          util.onError(err);
          return err;
        });
      });
    }

  };

};

module.exports = KAT;