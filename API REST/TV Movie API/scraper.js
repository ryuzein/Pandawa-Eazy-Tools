const async = require("async-q"),
  config = require("./config"),
  eztv = require("./providers/show/eztv")("EZTV"),
  katMovie = require("./providers/movie/kat"),
  katShow = require("./providers/show/kat"),
  util = require("./util");

/* Start movie scraping from KAT. */
const scrapeKATMovies = () => {
  return async.eachSeries(config.movieProviders, (provider) => {
    util.setStatus("Scraping " + provider.name);
    const katProvider = katMovie(provider.name);
    return util.spawn(katProvider.search(provider)).then((response) => {
      util.log(provider.name + ": Done.");
      return response;
    });
  });
};
  
/* Start show scraping from KAT. */
const scrapeKATShows = () => {
  return async.eachSeries(config.showProviders, (provider) => {
    util.setStatus("Scraping " + provider.name);
    const katProvider = katShow(provider.name);
    return util.spawn(katProvider.search(provider)).then((response) => {
      util.log(provider.name + ": Done.");
      return response;
    });
  });
};

/* Start scraping from EZTV. */
const scrapeEZTV = () => {
  util.setStatus("Scraping " + eztv.name);
  return util.spawn(eztv.search()).then((response) => {
    util.log(eztv.name + ": Done.");
    return response;
  });
};

module.exports = {

  /* Initiate the scraping. */
  scrape: () => {
	let start_time = new Date();
    let scrapers = [];
	
    if(config.scrapers.tv.eztv) scrapers.push(scrapeEZTV);
	if(config.scrapers.movies.kat) scrapers.push(scrapeKATMovies);
    if(config.scrapers.tv.kat) scrapers.push(scrapeKATShows);
    
	util.resetTemp('.log');
    util.setlastUpdate();
	
    if(scrapers.length !== 0) {
      async.eachSeries(scrapers, (scraper) => {
        return scraper();
      }).then((value) => {
        return util.setStatus("Idle");
      }).catch((err) => {
        util.onError("Error while scraping: " + err);
        return err;
      }).done(() => {
        util.setUpdateTime(start_time, new Date());
      });
    } else {
      util.onError("Error while scraping: No scrapers enabled");
      return "No scrapers enabled";
    }
  }

};
