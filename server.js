const express = require("express");
const nunjucks = require("nunjucks");
const routes = require("./routes");

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.static("public"));
server.use(routes);

server.set("view engine", "njk");

nunjucks.configure("views", {
  express: server,
  autoescape: false,
  noCache: true,
});

let port = 3000;
server.listen(port, function () {
  console.log(`o servidor ta on na porta ${port}`);
});
