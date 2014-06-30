/*jslint browser: true, onevar: true*/
/*global window, utils*/
(function () {
	// decalare varibles
	var canvas = utils.$('#ball'),
		angle = 45,
		context = canvas.getContext('2d');
	// Ball constructor
	function Ball(canvas, options) {
		if(typeof(options.x) == 'undefined'){
			options.x = 200;
		}
		if(typeof(options.y) == 'undefined'){
			options.y = 200;
		}
		if(typeof(options.color) == 'undefined'){
			options.color = "#ff0000";
		}
		if(typeof(options.radius) == "undefined"){
			options.radius = 45;
		}
		this.canvas = canvas;
		this.x = options.x;
		this.y = options.y;
		this.color = options.color;
		this.rotation = 1;
		this.lineWidth = 1;
		this.radius = options.radius;
		this.scaleX = 1;
		this.scaleY = 1;
	}

	Ball.prototype = {
		draw : function (ctx) {
			ctx.beginPath();
			ctx.strokeStyle = "#666";
			ctx.fillStyle = "#ff0000";
			ctx.save();
			ctx.translate(this.x,this.y);
			ctx.scale(this.scaleX,this.scaleY);
			ctx.arc(0,0,this.radius,0,2*Math.PI,true);
			ctx.fill();
			ctx.stroke();
			ctx.restore();
			ctx.closePath();
		}
	};

	/*
	 * events
	 */
	utils.addEvent(window, 'load', function () {
		utils.fullScreen(canvas);
	});

	utils.addEvent(window, 'resize', function () {
		utils.fullScreen(canvas);
	});

	// animation frame loops
	(function drawFrame() {
		window.requestAnimationFrame(drawFrame, canvas);
		var ball = new Ball(canvas,{
			x : 200,
			y : 200}),
		centerY = canvas.height/2,
		centerX= canvas.width/2,
		range =1,
		speed = 0.05,
		radiusX = 150,
		radiusY = 100,
		radian = angle*Math.Pi/180;
		context.clearRect(0, 0, canvas.width, canvas.height);
		// make ball rotate an circle
		ball.y = centerY + Math.sin(angle) * radiusY;
		ball.x = centerX + Math.cos(angle) * radiusX;
		ball.scaleX = ball.scaleY = 1 + Math.sin(angle) * range;
		angle += speed;
		ball.draw(context);
	}());
}());
