const express = require("express");

const config = require("./config/config");

const app = express();

require(config.rootPath + "/config/express")(app, config);

require("http")
  .createServer(app)
  .listen(config.port, function () {
    console.log("HTTP Server listening on port: ", config.port);
  });
