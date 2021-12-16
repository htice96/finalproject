const path = require("path");

const config = {
  rootPath: path.normalize(__dirname + "/.."),
  port: 8080,
  dbURL: "mongodb://localhost/widgets",
  secret: "cayennedlikedhistreats",
};
module.exports = config;
