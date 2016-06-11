/**
 * Created by Lars on 29.04.2016.
 */

module.exports = function(express, HTMLSync) {
    var router = express.Router();

    router.get("/", function(req, res){
        var room = HTMLSync.getRoom("game");
        console.log("Room:" ,room);
        if(!room || !room.hasParts()){
            console.log("Creating Tokens");
            for(var i = 0; i < 16; i++){
                var part = new HTMLSync.Part("img");
                part.attr({
                    "className":"token",
                    "src": "/game/" + i + ".png",
                });
                part.room = "game";
                part.parent = "storage";
                part.on("lock", function(e){
                    console.log(e, "locked the tokene");
                });
                part.on("unlock", function(){
                   console.log("Token is now unlocked");
                });
                HTMLSync.add(part);
            }
        }
        res.render("game");
    });

    return router;
};