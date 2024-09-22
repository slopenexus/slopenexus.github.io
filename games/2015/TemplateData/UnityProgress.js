function init() {

}

function UnityProgress (dom) {
	this.progress = 0.0;
	this.message = "";
	this.dom = dom;
	var parent = dom.parentNode;

	createjs.CSSPlugin.install(createjs.Tween);
	createjs.Ticker.setFPS(60);
	
	var background = document.createElement("img");
	background.src = "TemplateData/Y8LoadingScreen_900x600_StaticLogoSpinner.gif";
	background.style.position = "absolute";
	parent.appendChild(background);
	this.background = background;	
	
// 	document.getElementById("spinnerMain").style.display = "inherit";


	this.SetProgress = function (progress) { 
		if (this.progress < progress) {
			this.progress = progress;
		}
		if (progress == 1) {
			this.SetMessage("Preparing...");
			document.getElementById("spinner").style.display = "inherit";
			document.getElementById("bgBar").style.display = "none";
			document.getElementById("progressBar").style.display = "none";
		} 
		this.Update();
	}

	this.SetMessage = function (message) { 

                if ((m = message.match(/^Downloading data... \(([0-9]+)\/([0-9]+)\)/)) !== null) {
                  message = this.RewriteMessage(m)
                }

		this.message = message;
		this.background.style.display = "inline";		
		this.Update();
	}

        this.RewriteMessage = function (m) {
          var downloaded = this.FormatBytes(parseInt(m[1]), 2);
          var total = this.FormatBytes(parseInt(m[2]), 2);
          var message = m[0].replace(m[1], downloaded);
          return message.replace(m[2], total);
        }

        this.FormatBytes = function(bytes,decimals) {
          if(bytes == 0) { return '0 Byte'; }
          var k = 1000;
          var dm = decimals + 1 || 3;
          var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
          var i = Math.floor(Math.log(bytes) / Math.log(k));
          return (bytes / Math.pow(k, i)).toPrecision(dm) + ' ' + sizes[i];
        }

	this.Clear = function() {
		this.background.style.display = "none";	
		document.getElementById("loadingBox").style.display = "none";
// 		document.getElementById("spinnerMain").style.display = "none";

	}

	this.Update = function() {
		var background = new Image();

		this.background.style.top = this.dom.offsetTop + 'px';
		this.background.style.left = this.dom.offsetLeft + 'px';
		this.background.style.width = this.dom.offsetWidth + 'px';
		this.background.style.height = this.dom.offsetHeight + 'px';		
		
		var length = 200 * Math.min(this.progress, 1);
		bar = document.getElementById("progressBar");
		createjs.Tween.removeTweens(bar);
		createjs.Tween.get(bar).to({width: length}, 500, createjs.Ease.sineOut);
		bar.style.width = length + "px";
		document.getElementById("loadingInfo").innerHTML = this.message;
	}

	this.Update();
}


