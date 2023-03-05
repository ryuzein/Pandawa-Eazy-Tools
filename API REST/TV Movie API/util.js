const CronJob = require("cron").CronJob,
  fs = require("fs"),
  path = require("path"),
  join = path.join,
  extname = path.extname,
  colors = require('colors/safe'),
  config = require("./config");

const makeTemp = () => {
  if (!fs.existsSync(config.tempDir)) {
    fs.mkdirSync(config.tempDir);
  }
};
  
module.exports = {

  /* Makes the temporary directory. */
  makeTemp: makeTemp,

  /* Logger function. */
  log: (logMessage) => {
    let date = new Date();
    let time = ('00' + date.getHours()).slice(-2) + ':' + ('00' + date.getMinutes()).slice(-2) + ':' + ('00' + date.getSeconds()).slice(-2);
    if(config.logs.info.output.console){
      if(config.logs.global.showTime.console){
        console.info('[' + time + '] ' + logMessage);
      } else {
        console.info(logMessage);
      }
    }
    if(config.logs.info.output.log){
      if(config.logs.global.showTime.log){
        fs.appendFile(join(config.tempDir, config.logs.info.file), '[' + time + '] ' + logMessage.replace(/\x1B\[\d+m/g, '') + "\n");
      } else {
        fs.appendFile(join(config.tempDir, config.logs.info.file), logMessage.replace(/\x1B\[\d+m/g, '') + "\n");
      }
    }
  },
  
  /* Error logger function. */
  onError: (errorMessage) => {
    let date = new Date();
    let time = ('00' + date.getHours()).slice(-2) + ':' + ('00' + date.getMinutes()).slice(-2) + ':' + ('00' + date.getSeconds()).slice(-2);
    if(typeof errorMessage === 'string') {
	  if(errorMessage.toLowerCase().startsWith('error')){
        if(config.logs.error.output.console){
          if(config.logs.global.showTime.console){
            console.error((config.colorOutput ? colors.red('[' + time + '] ' + errorMessage) : '[' + time + '] ' + errorMessage));
          } else {
            console.error((config.colorOutput ? colors.red(errorMessage) : errorMessage));
          }
        }
        if(config.logs.error.output.log){
          if(config.logs.global.showTime.log){
            fs.appendFile(join(config.tempDir, config.logs.error.file), '[' + time + '] ' + errorMessage.replace(/\x1B\[\d+m/g, '') + "\n");
          } else {
            fs.appendFile(join(config.tempDir, config.logs.error.file), errorMessage.replace(/\x1B\[\d+m/g, '') + "\n");
          }
        }
      } else {
        if(config.logs.warning.output.console){
          if(!errorMessage.toLowerCase().startsWith('error')){
            if(config.logs.global.showTime.console){
              console.warn(config.colorOutput ? colors.yellow('[' + time + '] ' + errorMessage) : '[' + time + '] ' + errorMessage);
            } else {
              console.warn(config.colorOutput ? colors.yellow(errorMessage) : errorMessage);
            }
          }
        }
        if(config.logs.warning.output.log){
          if(!errorMessage.toLowerCase().startsWith('error')){
            if(config.logs.global.showTime.log){
              fs.appendFile(join(config.tempDir, config.logs.warning.file), '[' + time + '] ' + errorMessage.replace(/\x1B\[\d+m/g, '') + "\n");
            } else {
              fs.appendFile(join(config.tempDir, config.logs.warning.file), errorMessage.replace(/\x1B\[\d+m/g, '') + "\n");
            }
          }
        }
      }
    } else {
	  //Non String Msgs
      if(config.logs.error.output.console){
        if(config.logs.global.showTime.console){
          console.error((config.colorOutput ? colors.red('[' + time + '] ' + errorMessage) : '[' + time + '] ' + errorMessage));
        } else {
          console.error((config.colorOutput ? colors.red(errorMessage) : errorMessage));
        }
      }
      if(config.logs.error.output.log){
        if(config.logs.global.showTime.log){
          fs.appendFile(join(config.tempDir, config.logs.error.file), '[' + time + '] ' + errorMessage.toString().replace(/\x1B\[\d+m/g, '') + "\n");
        } else {
          fs.appendFile(join(config.tempDir, config.logs.error.file), errorMessage.toString().replace(/\x1B\[\d+m/g, '') + "\n");
        }
      }
    }
    return new Error(errorMessage);
  },

  /* Updates the 'lastUpdated' file. */
  setlastUpdate: () => {
    setTimeout(() => {
      fs.writeFile(join(config.tempDir, config.updatedFile), JSON.stringify({
        lastUpdated: Math.floor(new Date().getTime() / 1000)
      }), (err) => {});
	}, 0);
  },

  
  /* Updates the 'updateTime' file. */
  setUpdateTime: (start_time, end_time) => {
    let delta = Math.abs(end_time - start_time) / 1000;
    let days = Math.floor(delta / 86400);
    delta -= days * 86400;
    let hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    let minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    let seconds = Math.floor(delta % 60);
    let updateTime = "";
    
    if( hours != 0 ) updateTime += hours + "h "
    if( minutes != 0 ) updateTime += minutes + "m "
    if( seconds != 0 ) updateTime += seconds + "s"
    
    setTimeout(() => {
      fs.writeFile(join(config.tempDir, config.updateTimeFile), JSON.stringify({
        lastUpdate: (updateTime.trim())
      }), (err) => {});
    }, 0);
  },

  /* Updates the 'status' file. */
  setStatus: (status) => {
	setTimeout(() => {
      fs.writeFile(join(config.tempDir, config.statusFile), JSON.stringify({
        "status": status
      }), (err) => {});
    }, 0);
  },

  /*
  * Function for resolving generators.
  * Method from: https://www.youtube.com/watch?v=lil4YCCXRYc
  */
  spawn: (generator) => {
    return new Promise((resolve, reject) => {
      let onResult = (lastPromiseResult) => {
        let {
          value, 
          done
        } = generator.next(lastPromiseResult);
        if (!done) {
          value.then(onResult, reject)
        } else {
          resolve(value);
        }
      };
      onResult();
    });
  },

  /* Removes all the files in the temporary directory. */
  resetTemp: (callback, filter, path = config.tempDir) => {
    const files = fs.readdirSync(path);
	files.forEach((file) => {
      const stats = fs.statSync(join(path, file));
      if (stats.isDirectory()) {
        resetTemp(file, filter);
      } else if (stats.isFile()) {
        if(filter !== 'undefined'){
          if(extname(file) == filter) fs.unlinkSync(join(path, file));
        } else {
          fs.unlinkSync(join(path, file));
        }
      }
    });
    makeTemp();
  }

};
