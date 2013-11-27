var DSA = DSA || {};

var Shoot = function(document, video,imageHolder, shootHolder, imageSize){
	var that = this;

	this.doc = document;
	this.holder = imageHolder;
	this.shootHolder = shootHolder;
	this.video = video;
	this.sizeObj = imageSize;
	this.videoClone = null;
	this.curTime = 0;
	this.serlCount = 0;
	this.isOnFlow = true;
	this.isPlaying = false;

	function init(){
		var id = that.video.id + "-clone";

		$(that.doc.body).prepend("<video id='"+ id +"' controls style='display:none;'>"+
									"<source src='"+$(that.video).find('source').attr('src')+"'></source>"+
									"Your browser does not support HTML5 video."+
								"</video>");
		
		that.videoClone = $('#' + id);

		if(DSA && DSA.Events){
			DSA.Events.register(that.videoClone.get(0), 'loadstart', function(e){
				that.videoClone.get(0).playbackRate = 1;
				that.videoClone.get(0).play();					
			}, false);

			DSA.Events.register(that.videoClone.get(0), 'timeupdate', function(e){
				that.isOnFlow && (that.curTime = that.videoClone.currentTime);
				
				draw(that.videoClone.get(0), that.doc, that.sizeObj, that.holder);
			}, false);

			DSA.Events.register(that.video, 'play', function(){
				that.isPlaying = true;
			});

			DSA.Events.register(that.video, 'pause', function(){
				that.isPlaying = false;
			});

			DSA.Events.register(that.video, 'timeupdate', function(){
				that.addPreview(5);
			});

			DSA.Events.register(that.video, 'seeking', function(){
				if(that.videoClone.get(0).currentTime <= that.video.currentTime()){
					that.isOnFlow = false;

					//need to continue generate the images from the new place and set isOnFlow = false
					//add a new object array to store the skipped places
					//once the 'ended' event fired scan the skipped places and generate the images

					that.gapCame = [{
						s : that.videoClone.get(0).currentTime,
						e : that.video.currentTime
					}];
					

					if(that.previewCount){

					}else{
						shootOnTime(that.video.currentTime, that.videoClone.get(0), that.doc, that.sizeObj, that.shootHolder);
					}

				}
			});

			DSA.Events.register(that.videoClone.get(0), 'loadeddata', function(){
				console.log('suspended');
			});
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
			//$(canvas).addClass('slide');
			$(canvas).attr('time', video.currentTime);
			$(canvas).attr('serl', that.serlCount++);
			context.drawImage(video, 0, 0, w, h);
			$(holder).append(canvas);
		}				
	};

	function getSerNo(timeStamp, holder){

		var start = 1,
			max = $(holder).find('canvas').length,
			end = max;	

		for(var i = start; i <= max; i++){

			var avg = Math.round((start + end) / 2),
				time = $(holder).find('[serl = '+avg+']').attr('time');

			if(time == timeStamp){
				return (avg - 1);
				break;
			}else if(start == end){
				return (start - 1);
				break;
			}else if(time > timeStamp){
				end = avg - 1;
			}else if(time < timeStamp){
				start = avg + 1;
			}else if(start > end){
				return end;
			}	
		}
	};

	function shootOnTime(time, videoClone,doc, sizeObj, holder){
		videoClone.pause();
		videoClone.currentTime = time;
		draw(videoClone, doc, sizeObj, holder);
	};

	function cloneCanvas(doc, source){
		var canvas = doc.createElement('canvas'),
			context = canvas.getContext('2d');

		canvas.width = source.width;
		canvas.height = source.height;
		context.drawImage(source, 0 ,0);
		return canvas;
	};

	function cloneImages(doc,from, to, serlno){
		$(cloneCanvas(doc, $(from).find('[serl = '+serlno+']').get(0))).appendTo(to);

		//$(from).find('[serl = '+serlno+']').clone().appendTo(to);
	};

	this.shoot = function(){

		if(that.video.currentTime > that.videoClone.currentTime){
			that.isOnFlow = false;
			shootOnTime(that.video.currentTime, that.videoClone, that.doc, that.sizeObj, that.shootHolder);
			that.isOnFlow = true;
			that.videoClone.currentTime = that.curTime;
			that.videoClone.play();
		}else{
			return $(this.holder).find('[serl='+getSerNo(this.video.currentTime, this.holder)+']');
		}
	};

	this.addPreview = function(count){
		var serlNo = getSerNo(that.video.currentTime, that.holder),
			nos = [],
			left,
			right;

		that.previewCount = count;
		that.shootHolder.innerHTML = "";

		if(count % 2 === 1){
			left = serlNo - (count - 1)/2;
			right = serlNo + (count - 1)/2;
		}else{
			left = serlNo - (count / 2 - 1);
			right = serlNo + (count / 2);
		}

		for(var i = left; i <= right; i++){
			if(i >= 0){
				nos.push(i);
				cloneImages(that.doc,that.holder, that.shootHolder, i);
			}
		}
	};

	init();

	return {
		holder : that.holder,
		video : that.video,

		shoot : that.shoot,
		addPreview : that.addPreview
	}
}

