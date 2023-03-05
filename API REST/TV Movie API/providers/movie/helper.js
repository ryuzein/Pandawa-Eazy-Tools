const async = require("async-q"),
  Movie = require("../../models/Movie"),
  trakt = require("../../lib/trakt"),
  config = require("../../config"),
  colors = require("colors/safe"),
  util = require("../../util");
let name;

/* Update a given movie (doc) */
const updateMovie = function*(doc) {
  const found = yield Movie.findOne({
    _id: doc._id
  }).exec();
  if (found) {
    util.log(name + ": '" + (config.colorOutput ? colors.cyan(found.title) : found.title) + "' is an existing movie.");

    if ((!doc.torrents["480p"] && found.torrents["480p"]) || (doc.torrents["480p"] && found.torrents["480p"] && doc.torrents["480p"].seeds < found.torrents["480p"].seeds) || (doc.torrents["480p"] && found.torrents["480p"] && doc.torrents["480p"].magnet === found.torrents["480p"].magnet)) {
      doc.torrents["0"] = found.torrents["480p"];
      doc.torrents["480p"] = found.torrents["480p"];
    }
    if ((!doc.torrents["720p"] && found.torrents["720p"]) || (doc.torrents["720p"] && found.torrents["720p"] && doc.torrents["720p"].seeds < found.torrents["720p"].seeds) || (doc.torrents["720p"] && found.torrents["720p"] && doc.torrents["720p"].magnet === found.torrents["720p"].magnet)) {
      doc.torrents["720p"] = found.torrents["720p"];
    }
    if ((!doc.torrents["1080p"] && found.torrents["1080p"]) || (doc.torrents["1080p"] && found.torrents["1080p"] && doc.torrents["1080p"].seeds < found.torrents["1080p"].seeds) || (doc.torrents["1080p"] && found.torrents["1080p"] && doc.torrents["1080p"].magnet === found.torrents["1080p"].magnet)) {
      doc.torrents["1080p"] = found.torrents["1080p"];
    }

    return Movie.findOneAndUpdate({
      _id: doc._id
    }, doc).exec();
  } else {
    util.log(name + ": '" + (config.colorOutput ? colors.cyan(doc.title) : doc.title) + "' is a new movie!");
    return new Movie(doc).save();
  }
};

const Helper = (_name) => {

  name = _name;

  return {

    /* Adds torrents to a movie. */
    addTorrents: (movie, torrents) => {
      return async.each(Object.keys(torrents), (torrent) => {
        movie.torrents[torrent] = torrents[torrent];
      }).then((value) => {
        return util.spawn(updateMovie(movie));
      });
    },

    /* Get info from Trakt and make a new movie object. */
    getTraktInfo: function*(slug) {
      const traktMovie = yield trakt.getMovie(slug);
      const traktWatchers = yield trakt.getMovieWatching(slug);
      if (traktMovie.ids["imdb"]) {
        return {
          _id: traktMovie.ids["imdb"],
          imdb_id: traktMovie.ids["imdb"],
          title: traktMovie.title,
          year: traktMovie.year,
          slug: traktMovie.ids["slug"],
          synopsis: traktMovie.overview,
          runtime: traktMovie.runtime,
          rating: {
            hated: 100,
            loved: 100,
            votes: traktMovie.votes,
            watching: traktWatchers.length,
            percentage: Math.round(traktMovie.rating * 10)
          },
          country: traktMovie.language,
          last_updated: Number(new Date()),
          images: {
            fanart: traktMovie.images.fanart.full != null ? traktMovie.images.fanart.full : "/img/placeholder.png",
            poster: traktMovie.images.poster.full != null ? traktMovie.images.poster.full : "/img/placeholder_fanart.png",
            banner: traktMovie.images.banner.full != null ? traktMovie.images.banner.full : "/img/placeholder_banner.png"
          },
          genres: traktMovie.genres.length != 0 ? traktMovie.genres : ["Unknown"],
          released: new Date(traktMovie.released).getTime() / 1000.0,
          trailer: traktMovie.trailer,
          certification: traktMovie.certification,
          torrents: {}
        }
      }
    }

  };

};

module.exports = Helper;