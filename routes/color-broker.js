/**
 * Created by Lars on 29.04.2016.
 */

module.exports = function(express, HTMLSync) {
    var router = express.Router();

    var colors = [];

    var colorLeftClick = function(e){
      buy(e);
    };

    var colorRightClick = function(e){
        sell(e);
    };

    router.get("/", function(req, res){
        var room = HTMLSync.getRoom("color-broker");
        if(!room || !room.hasParts()){
            console.log("Creating Tokens");
            for(var i = 0; i < 3; i++){
                for(var h = 1; h < 10; h++){

                    var part = new HTMLSync.Part("div");
                    part.attr({
                        "className":"color",
                    });
                    switch(i){
                        case 0:
                            var r = h;
                            var g = 0;
                            var b = 0;
                            break;
                        case 1:
                            var r = 0;
                            var g = h;
                            var b = 0;
                            break;
                        case 2:
                            var r = 0;
                            var g = 0;
                            var b = h;
                            break;
                    }
                    function toHex(x){
                        x = x.toString(16);
                        if(x.length < 2){
                            x = "0" + x;
                        }
                        return x;
                    }
                    var color = "#" + toHex(r * 25) + toHex(g * 25) + toHex(b * 25);
                    part.data.color = color;
                    part.css({
                        backgroundColor:color,
                    });

                    part.on("click", colorLeftClick);
                    part.on("contextmenu", colorRightClick);
                    part.on("buy", function(){
                        console.log("Got bought", this.id);
                        var value = parseFloat(this.data.value) + 0.1;
                        this.data.value = value;
                    });

                    part.on("sell", function(){
                        var value = parseFloat(this.data.value) - 0.1;
                        this.data.value = value;
                    });

                    var value = (Math.random() * 5).toFixed(2);
                    part.data.value = value;
                    part.data.grow = 0;
                    part.attr("innerHTML", value + "€" );
                    
                    part.room = "color-broker";
                    part.parent = "storage";
                    HTMLSync.add(part);
                    colors.push(part);
                }
            }
        }

        res.render("color-broker");
    });

    HTMLSync.instance.on("join", function(msg, socket){
       if(msg.room === "color-broker"){
           socket.on("start", function(params){
              startGame(params);
           });
       }

        var room = HTMLSync.getRoom(msg.room);
        var updates = Object.keys(room.updates);
        console.log("Updates:", room.updates);
        for(var i = 0; i < updates.length; i++){
            console.log("update", room.updates[updates[i]]);
        }
    });

    function gameLoop(){
        for(var i in colors){
            var c = colors[i];
            c.data.value = parseFloat(c.data.value);
            var percent = parseFloat((Math.random() * 10 - 2.5).toFixed(2));
            var pw = c.data.value / 100 * percent;
            var newValue = parseFloat((parseFloat(c.data.value) + pw).toFixed(2));

            if(newValue > c.data.value - 0.01 && newValue < c.data.value + 0.01){
                if(newValue > c.data.value){
                    newValue += 0.01;
                    percent = 1;
                }else{
                    newValue -= 0.01;
                    percent = -1;
                }
            }

            newValue = Math.max(newValue, 0.01);

            if(percent > 0){
                percent = "+" + percent;
            }
            HTMLSync.update({
                id: c.id,
                roomId: "color-broker",
                data:{
                    value :newValue.toFixed(2),
                },
                attr:{
                    innerHTML: newValue + "€ " + percent + "%"
                }
            },true)
        }
    }

    function startGame(){
        console.log("starting game...");
        setInterval(gameLoop, 5000);
    }

    return router;
};