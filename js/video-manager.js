var DSA = DSA || {};

var VideoMngr = function(document, video){
	var doc = document;

	this.video = video;
	this.muted = null;
	this.paused = null;
	this.playbackRate = this.video.playbackRate;

	this.init = function(){
		var that = this;

		that.muted = that.video.muted;
		that.paused = that.video.paused;

		if(DSA && DSA.Events){
			DSA.Events.register(that.video, 'play', function(e){
				that.paused = false;
			}, false);
			DSA.Events.register(that.video, 'pause', function(e){
				that.paused = true;
			}, false);
		}
	};

	this.load = function(){
		this.video.load();
	};

	this.play = function(){
		this.paused = false;
		this.video.play();
	};

	this.pause = function(){
		this.paused = true;
		this.video.pause();
	};

	this.mute = function(){
		this.video.muted = true;
		this.muted = true;
	};

	var getCurrentTime = function(){
		return this.video.currentTime;
	};

	var addplaybackRate = function(){
		this.playbackRate += 1;
		this.video.playbackRate = this.playbackRate;
	};

	var subplaybackRate = function(){
		if(this.playbackRate > 1){
			this.playbackRate -= 1;
		}else{ return false; }
		
		this.video.playbackRate = this.playbackRate;
	};

	return {
		video : this.video,
		muted : this.muted,
		paused : this.paused,
		playbackRate : this.playbackRate,
		load : this.load,
		play : this.play,
		pause : this.pause,
		mute : this.mute,
		getCurrentTime : getCurrentTime,
		addplaybackRate : addplaybackRate,
		subplaybackRate : subplaybackRate,
		init : this.init
	}
}