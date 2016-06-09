/**
 * Created by Lars on 30.04.2016.
 */

var htmlSync = new HTMLSync({
    room: "color-broker",
    debug:false,
});

var myId;
var nameId;
var money = 10;
var storage = {
    getKey: function(key){
        if(this[key]){
            return this[key].amount;
        }else{
            return 0;
        }
    },
    add: function(key){
        if(this[key] && this[key].amount != 0){
            this[key].amount++;
            var part = HTMLSync.parts[this[key].id];
            part.update({
               attr:{
                   innerHTML: "x" + this[key].amount,
               }
            });
        }else{
            var part = new Part("div");
            part.attr({
               className:"tiny-color",
                innerHTML:"x1",
            });
            part.css("backgroundColor", key);
            part.data.color = key;
            part.parent = myId;
            HTMLSync.add(part);
            this[key] = {
                amount:1,
                id: part.id
            };
        }
    },
    remove: function(key){
        if(this[key] && this[key].amount > 0){
            this[key].amount--;
            var part = HTMLSync.parts[this[key].id];
            part.update({
                attr:{
                    innerHTML: "x" + this[key].amount,
                }
            });
        }else{
            this[key].amount = 0;
        }
        if(this[key].amount == 0){
            console.log("Deleting", this[key].id);
            HTMLSync.deleteObj(this[key].id);
            delete(this[key]);
        }
    }
};

var buy = function(e){
    var el = HTMLSync.parts[e.target.id];
    var c = el.data.color;
    var value = el.data.value;
    if(value <= money){
        addMoney(-1 * value);
        storage.add(c);
    }

};

var sell = function(e){
    e.preventDefault();
    var el = HTMLSync.parts[e.target.id];
    var c = el.data.color;
    var value = el.data.value;
    if(storage.getKey(c) > 0){
        addMoney(parseFloat(value));
    }
    storage.remove(c);
};

$(window).load(function(){
   $("#chooseNameBtn").click(function(){
       var name = $("#nameInput").val();
       var player = new Part("div");
       player.attr({
          className:"player",
       });

       var namePart = new Part("div");
       namePart.attr({
           innerHTML: name + " 10.00€",
           className: "playerName"
       });
       namePart.name = "name";

       namePart.data.name = name;
       namePart.data.money = 10;

       namePart.parent = player.id;

       player.parent = "player-wrapper";
       HTMLSync.add(player);
       HTMLSync.add(namePart);
       $("#nameInput").hide();
       $(this).hide();
       myId = player.id;
   });
});

function addMoney(amount){
    money = parseFloat(money);
    money += parseFloat(amount);
    money = parseFloat(money.toFixed(2));
    var part = HTMLSync.parts[myId].find("name");
    part.update({
       data:{
           money:money,
       },
        attr:{
            innerHTML: part.data.name + " " + money + "€"
        }
    }, true);
}
