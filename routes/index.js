var PerlinGenerator = require("proc-noise");

module.exports = function(express,HTMLSync){
  var Part = HTMLSync.Part;
  var router = express.Router();

  /* GET home page. */
  router.get("/", function(req, res){
    res.render('index', {});
  });
  
  router.get("/test", function(req, res){
    var hPerlin = new PerlinGenerator();
    var img = {x: 200, y: 200, string: ""};

    for(var x = 0; x < img.x; x++){
      for(var y = 0; y < img.y; y++){
        var string = parseInt(hPerlin.noise(x/25,y/25) * 255).toString(16);
        while(string.length < 2){
          string = "0" + string;
        }
        img.string += string;
      }
    }
    res.render('test', {img: JSON.stringify(img)});
  });

  return router;
};
