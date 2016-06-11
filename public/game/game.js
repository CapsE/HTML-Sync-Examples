/**
 * Created by Lars on 29.04.2016.
 */

var htmlSync = new HTMLSync({
    room: "game",
    debug:false
});

interact('.token')
    .draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
            endOnly: true
        },
        // enable autoScroll
        autoScroll: true,

        onstart: function(e) {
            var target = e.target;
            var offset = $(target).offset();
            console.log(offset);
            // keep the dragged position in the data-x/data-y attributes
            var x = e.clientX0 - (e.clientX0 - offset.left);
            var y = e.clientY0 - (e.clientY0 - offset.top);

            // translate the element
            target.style.webkitTransform =
                target.style.transform =
                    'translate(' + x + 'px, ' + y + 'px)';

            // update the posiion attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
            HTMLSync.parts[target.id].lock();
        },

        // call this function on every dragmove event
        onmove: dragMoveListener,
        // call this function on every dragend event

        onend: function(e){
            HTMLSync.parts[e.target.id].unlock();
        }
    });

interact('.field').dropzone({
   ondrop: function(e){
       console.log("drop");
       var element = HTMLSync.parts[e.relatedTarget.id];
       var posField = $(e.target).offset();
       var x = posField.left;
       var y = posField.top;
       element.update({
           style:{
               transform: "translate(" + x + "px, " + y + "px)",
               position: "fixed",
               top:"0px",
               left:"0px",
           },
           data:{
               x: x,
               y: y,
           }
       }, true);
   }
});

function dragMoveListener (event) {
    var target = event.target,
    // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    HTMLSync.parts[target.id].update({
        style:{
            transform: "translate(" + x + "px, " + y + "px)",
            position: "fixed",
            top:"0px",
            left:"0px",
        },
        data:{
            x: x,
            y: y,
        }
    }, true);
}

// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;

$(window).load(function(){
    $("#reset").click(function(){
        var r = confirm("Spiel zurücksetzen?");
        if (r == true) {
            $(".token").each(function(){
                var e = HTMLSync.parts[$(this).attr("id")];
                e.update({
                    style:{
                        transform: "translate(" + 0 + "px, " + 0 + "px)",
                        position: "static"
                    },
                    data:{
                        x: 0,
                        y: 0,
                    }
                }, true);
            });
        }
    });
});
