window.addEventListener("keydown", function(e) {
  // space and arrow keys
  if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
}, false);
document.onmousedown = function() {window.focus();};

$(window).resize(updateCanvasDim);
$(document).ready(updateCanvasDim);

function updateCanvasDim() {
  Game.resize(getQueryVariable('ratio_tolerant'));
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
}

var Game = new function() {
  var self = {

    resize: function(ratio_tolerant) {
      var canvas              = $('#canvas');
      var bg                  = $('.template-wrap img:last');
      var item_size_ratio     = canvas.attr('width') / canvas.attr('height');

      var max_height          = window.innerHeight - 58;
      var max_width           = window.innerWidth;
      var window_size_ratio   = max_width / max_height;

      if (ratio_tolerant == 'true') {
          new_style = { width: max_width, height: max_height };
          bg.css(new_style).attr(new_style);
          canvas.css(new_style).attr(new_style);
      } else if (ratio_tolerant == 'false') {
        if (item_size_ratio > window_size_ratio) {
          new_style = { width: max_width, height: max_width / item_size_ratio };
        } else {
          new_style = { width: max_height * item_size_ratio, height: max_height };
        }
        bg.css(new_style).attr(new_style);
        canvas.css(new_style).attr(new_style);
      }
    }
  }

  return self;
}