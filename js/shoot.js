var DSA = DSA || {};

var Shoot = function(document, video,imageHolder, imageSize){
	var that = this;

	this.doc = document;
	this.holder = imageHolder;
	this.video = video;
	this.sizeObj = imageSize;
	this.videoClone = null;
	this.curTime = 0;

	function init(){
		var id = that.video.id + "-clone";

		$(that.doc.body).prepend("<video id='"+ id +"' controls style='display:none;'>"+
									"<source src='"+$(that.video).find('source').attr('src')+"'></source>"+
									"Your browser does not support HTML5 video."+
								"</video>");
		//$(that.videoClone).hide();
		that.videoClone = $('#' + id);

		if(DSA && DSA.Events){
			DSA.Events.register(that.videoClone.get(0), 'loadstart', function(e){
				that.videoClone.get(0).playbackRate = 1;
				that.videoClone.get(0).play();					
			}, false);

			DSA.Events.register(that.videoClone.get(0), 'timeupdate', function(e){
				draw(that.videoClone.get(0), that.doc, that.sizeObj, that.holder);
			}, false);
		}
	};

	function draw(video,doc, sizeObj, holder){

		if(video.paused || video.ended)  return false;

		for(var i in sizeObj){
			var canvas = doc.createElement('canvas'),
				context = canvas.getContext('2d'),
				w = sizeObj[i].width,
				h = sizeObj[i].height; 

			//$(canvas).width(w).height(h);
			$(canvas).get(0).width = w;
			$(canvas).get(0).height = h;
			$(canvas).attr('time', video.currentTime);
			context.drawImage(video, 0, 0, w, h);
			$(holder).append(canvas);
		}				
	};

	

	init();

	return {
		holder : that.holder,
		video : that.video
	}
}

