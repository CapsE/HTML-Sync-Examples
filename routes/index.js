var PerlinGenerator = require("proc-noise");

module.exports = function(express,HTMLSync){
  var Part = HTMLSync.Part;
  var router = express.Router();

  /* GET home page. */
  router.get("/", function(req, res){
    res.render('index', {});
  });

  return router;
};
