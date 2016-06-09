var PerlinGenerator = require("proc-noise");

module.exports = function(express,HTMLSync){
  var Part = HTMLSync.Part;
  var router = express.Router();

  /* GET home page. */
  router.get("/", function(req, res){
    var p = new Part("div");

    var color = "#ff0000";
    p.data.note = 440;
    p.on("click", function(){
      this.update({
        calls:[
          {name:"note"}
        ]
      });
    });
    p.on("note", function(){
      var sine = T("sin", {freq:this.data.note, mul:0.5});

      T("perc", {r:500}, sine).on("ended", function() {
        this.pause();
      }).bang().play();
      var color = this.css.borderColor;
      $("#" + this.id).css("border-color", "transparent transparent white transparent");
      TweenMax.to($("#" + this.id), 1, {
        borderColor: "transparent transparent " + color + " transparent",
      });
    });

    p.css({
      position: "fixed",
      left:80 + "px",
      top: 80 + "px",
      width: 0,
      height: 0,
      borderStyle: "solid",
      borderWidth: "0 50px 80px 50px",
      borderColor: "transparent transparent " + color + " transparent",
    });

    HTMLSync.add(p);

    res.render('index', {});
  });

  router.get("/:seed", function(req, res) {
    if(!HTMLSync.roomExists(req.params.seed)){
      generateField(req.params.seed);
    }

    res.render('index', {seed:req.params.seed});
  });

  function calcFrequency(n){
    n = parseInt(n* 75) +13;
    var exp = (n - 49) / 12;
    var f = Math.pow(2, exp) * 440;
    return f;
  };

  function generateField(seed){
    console.log("Generating...");
    var rPerlin = new PerlinGenerator(seed);
    var gPerlin = new PerlinGenerator(seed + 1);
    var bPerlin = new PerlinGenerator(seed + 2);

    for (var y = 0; y < 15; y++) {
      for (var x = 0; x < 41; x++) {
        var p = new Part("div");
        p.room = seed;
        var r = parseInt(rPerlin.noise(x/25,y/25) * 255);
        var g = parseInt(gPerlin.noise(x/25,y/25) * 255);
        var b = parseInt(bPerlin.noise(x/25,y/25) * 255);
        var color = "rgb(" + r + "," + g + "," + b + ")";
        p.data.note = calcFrequency(rPerlin.noise(x/25,y/25));
        p.data.color = color;
        p.on("click", function(){
          this.update({
            calls:[
              {name:"note"}
            ]
          },true);
        });
        p.on("note", function(){
          var sine = T("sin", {freq:this.data.note, mul:0.5});

          T("perc", {r:500}, sine).on("ended", function() {
            this.pause();
          }).bang().play();

          TweenMax.fromTo($("#" + this.id), 2,{
            "border-color": "transparent transparent rgb(255,255,255) transparent"
          },{
            "border-color": "transparent transparent " + this.data.color + " transparent",
          });
        });

        p.css({
          position: "fixed",
          top: y * 80 + "px",
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderWidth: "0 50px 80px 50px",

        });
        if (x % 2 == 0) {
          p.css({
            borderColor: "transparent transparent " + color + " transparent",
          });
        } else {
          p.css({
            transform: "rotate(180deg)",
            borderColor: "transparent transparent " + color + " transparent",
          });
        }
        if (y % 2 == 0) {
          p.css({
            left: x * 50 - 100 + "px",
          });
        } else {
          p.css({
            left: x * 50 -50 + "px",
          });
        }
        HTMLSync.add(p);
      }
    }
  }

  return router;
};
