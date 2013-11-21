var DSA = DSA || {};

var CanvasPlayer = function(document, videoElement, canvasElement){
	var doc = document,
		that = this;

	this.video = videoElement;
	this.canvas = canvasElement;
	this.CW  = this.canvas.width = this.video.offsetWidth;
	this.CH = this.canvas.height = this.video.offsetHeight;

	var setSize = function(width, height){
			this.CW = this.canvas.width = width;
			this.CH = this.canvas.height = height;
		},

		draw = function(video, context, w, h){
			if(video.paused || video.ended)  return false;

			context.drawImage(video, 0, 0, w, h);
			setTimeout(draw,20,video,context,w,h);
		};

	(function(){
		var context = that.canvas.getContext('2d'),
			w = that.CW,
			h = that.CH;

		if(DSA && DSA.Events){
			DSA.Events.register(that.video, "play", function(){
				draw(this, context, w, h);
			}, false);
		}
	})();

	return {
		video : this.video,
		canvas : this.canvas,
		width : this.CW,
		height : this.CH,
		setSize : setSize
	}
}