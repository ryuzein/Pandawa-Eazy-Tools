"use strict";

const app = require("express")(),
  cluster = require("cluster"),
  CronJob = require("cron").CronJob,
  cpuCount = require("os").cpus().length,
  domain = require("domain"),
  fs = require("fs"),
  config = require("./config"),
  scraper = require("./scraper"),
  util = require("./util");

require("./setup.js")(config, app);
require("./routes.js")(app);

if (cluster.isMaster) {
  for (let i = 0; i < Math.min(cpuCount, config.workers); i++) {
    cluster.fork();
  }

  util.makeTemp();
  util.setStatus("Idle");
  
  cluster.on("exit", (worker, code, signal) => {
    util.onError("Worker '" + worker.process.pid + "' died, spinning up another!");
    cluster.fork();
  });

  if (config.master) {
    const scope = domain.create();
    scope.run(() => {
      try {
        const job = new CronJob({
          cronTime: config.scrapeTime,
          onTick: () => {
            scraper.scrape();
          },
          onComplete: () => {
            util.setStatus("Idle");
          },
          start: true,
          timeZone: "America/Los_Angeles"
        });
        util.log("Cron job started");
      } catch (ex) {
        util.onError("Cron pattern not valid");
      }
      scraper.scrape();
    });
    scope.on("error", (err) => {
      util.onError(err);
    });
  }
} else {
  app.listen(config.port, config.ip);
}
