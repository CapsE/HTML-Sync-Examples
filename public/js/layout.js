/**
 * Created by Lars on 06.07.2016.
 */

$(window).load(function(){

    $(".markdown").each(function(){
       $(this).html(marked($(this).html()));
    });

});