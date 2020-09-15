var revisionController = require('../controller/revision.controller');
var individualController = require('../controller/individual.controller');
var authorController = require('../controller/author.controller');
module.exports = function(app) {
  revisionController(app);
  individualController(app);
  authorController(app);
}
