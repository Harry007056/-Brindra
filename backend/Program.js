const app = require("./app");

if (require.main === module) {
  require("./server");
}

module.exports = app;
