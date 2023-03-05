const controllers = require("./controllers/load.js");

/* Express Routing. */
module.exports = (app) => {
	
  app.get("/", controllers.index.getIndex);
  
  app.get("/logs", controllers.index.getLogs);
  app.get("/logs/info", controllers.index.getInfoLog);
  app.get("/logs/warning", controllers.index.getWarningLog);
  app.get("/logs/error", controllers.index.getErrorLog);
  
  app.get("/show/:id", controllers.shows.getShow);
  app.get("/shows", controllers.shows.getShows);
  app.get("/shows/:page", controllers.shows.getPage);
  app.get("/shows/select/:ids", controllers.shows.getShowGroup);
  
  app.get("/movie/:id", controllers.movies.getMovie);
  app.get("/movies", controllers.movies.getMovies);
  app.get("/movies/:page", controllers.movies.getPage);
  app.get("/movies/select/:ids", controllers.movies.getMovieGroup);
  
};
