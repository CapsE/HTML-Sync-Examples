/**
 * Created by Lars on 29.04.2016.
 */

module.exports = function(express, HTMLSync) {
    var router = express.Router();

    router.get("/", function(req, res){
        HTMLSync.getRoom("dame", true).then(function(room){
            if(!room || !room.hasParts()){
                console.log("Creating Tokens");
                //White Token
                for(var i = 0; i < 3; i++){
                    for(var h = 0; h < 4; h++) {
                        var part = new HTMLSync.Part("img");
                        part.attr({
                            "className": "token",
                            "src": "/dame/token-white.png",
                        });

                        part.data.color = "white";

                        var x = i * 75;
                        var y = h * 75 * 2;
                        if(i == 1){
                            y += 75;
                        }
                        part.css({
                            transform: "translate(" + x + "px,"+ y +"px)",
                        });
                        part.data.xOrigin = x;
                        part.data.yOrigin = y;

                        part.on("dblclick", function(e){
                            var json = {};
                            if(this.data.dame){
                                json.data = {dame:false};
                                json.attr = {src: "/dame/token-" + this.data.color + ".png" };
                            }else{
                                json.data = {dame:true};
                                json.attr = {src: "/dame/token-" + this.data.color + "-queen.png" };
                            }
                            this.update(json, true);
                        });
                        part.room = "dame";
                        part.parent = "board";
                        HTMLSync.add(part);
                    }
                }
                //Black Token
                for(var i = 0; i < 3; i++){
                    for(var h = 0; h < 4; h++) {
                        var part = new HTMLSync.Part("img");
                        part.attr({
                            "className": "token",
                            "src": "/dame/token-black.png",
                        });
                        part.data.color = "black";

                        var x = i * 75 + 5*75;
                        var y = h * 75 * 2;
                        if(i != 1){
                            y += 75;
                        }
                        part.css({
                            transform: "translate(" + x + "px,"+ y +"px)",
                        });
                        part.data.xOrigin = x;
                        part.data.yOrigin = y;

                        part.on("dblclick", function(e){
                            var json = {};
                            if(this.data.dame){
                                json.data = {dame:false};
                                json.attr = {src: "/dame/token-" + this.data.color + ".png" };
                            }else{
                                json.data = {dame:true};
                                json.attr = {src: "/dame/token-" + this.data.color + "-queen.png" };
                            }
                            this.update(json, true);
                        });

                        part.room = "dame";
                        part.parent = "board";
                        HTMLSync.add(part);
                    }
                }
            }

            res.render("dame");

        }, function(err){
            console.log(err);
            res.end(err);
        });
    });

    return router;
};