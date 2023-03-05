const fs = require("fs"),
  join = require("path").join,
  config = require("../config"),
  Movie = require("../models/Movie"),
  Show = require("../models/Show"),
  util = require("../util");
  
/* Displays a given file. */
const displayFile = (req, res, path, file) => {
  if (fs.existsSync(join(path, file))) {
    return res.sendFile(file, {
      root: path,
      headers: {
        "Content-Type": "text/plain; charset=UTF-8"
      }
    })
  } else {
    return res.json({
      error: "Could not find file: '" + join(path, file) + "'"
    })
  }
};
  
module.exports = {

  /* Display server info. */
  getIndex: (req, res) => {
    let lastUpdatedJSON;
    try{ lastUpdatedJSON = JSON.parse(fs.readFileSync(join(config.tempDir, config.updatedFile), "utf8")); }
    catch (e) { lastUpdatedJSON = { "lastUpdated": "Unknown" } }
    let updateTimeJSON;
    try{ updateTimeJSON = JSON.parse(fs.readFileSync(join(config.tempDir, config.updateTimeFile), "utf8")); }
    catch (e) { updateTimeJSON = { "lastUpdate": "Unknown" } }
    let packageJSON;
    try{ packageJSON = JSON.parse(fs.readFileSync("package.json", "utf8")); }
    catch (e) { packageJSON = { "version": "Unknown" } }
    let statusJSON;
    try{ statusJSON = JSON.parse(fs.readFileSync(join(config.tempDir, config.statusFile), "utf8")); }
    catch (e) { statusJSON = { "status": "Idle" } }
    
    return Movie.count({}).exec().then((movieCount) => {
      return Show.count({
        num_seasons: {
          $gt: 0
        }
      }).exec().then((showCount) => {
        let serverInfo = {
          server: config.serverName,
          status: statusJSON.status,
          totalMovies: movieCount,
          totalShows: showCount,
          updated: lastUpdatedJSON.lastUpdated,
          updateTook: updateTimeJSON.lastUpdate,
          uptime: process.uptime() | 0,
          version: packageJSON.version,
          repo: packageJSON.repository.url,
        };
    
        if(config.logs.info.output.log || config.logs.warning.output.log || config.logs.error.output.log) serverInfo.logs = {};
        if(config.logs.info.output.log) serverInfo.logs.info = "/logs/info";
        if(config.logs.warning.output.log) serverInfo.logs.warning = "/logs/warning";
        if(config.logs.error.output.log) serverInfo.logs.error = "/logs/error";
    
        return res.json(serverInfo);
      });
    }).catch((err) => {
      util.onError(err);
      return res.json(err);
    });    
  },
 
  /* Displays possible logs */
  getLogs: (req, res) => {
    let routes = {
		description: "Routes to log files, only enabled logs will show here.",
		logs: {}
	};

    if(config.logs.info.output.log) routes.logs.info = "/info";
    if(config.logs.warning.output.log) routes.logs.warning = "/warning";
    if(config.logs.error.output.log) routes.logs.error = "/error";
    
    return res.json(routes);
  }, 

  /* Displays the 'tv-api-warning.log' file. */
  getInfoLog: (req, res) => {
    return displayFile(req, res, config.tempDir, config.logs.info.file);
  },
 
  /* Displays the 'tv-api-warning.log' file. */
  getWarningLog: (req, res) => {
    return displayFile(req, res, config.tempDir, config.logs.warning.file);
  },
  
  /* Displays the 'tv-api-error.log' file. */
  getErrorLog: (req, res) => {
    return displayFile(req, res, config.tempDir, config.logs.error.file);
  }

};
