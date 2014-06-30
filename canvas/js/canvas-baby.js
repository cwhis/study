/*jslint browser: true, onevar: true*/
/*global window, utils*/
(function () {
	// decalare varibles
	var canvas = utils.$('#baby'),
		angle = 45,
		context = canvas.getContext('2d');
	// Ball constructor
	function Ball(canvas, options) {
		if(typeof(options.x) == 'undefined'){
			options.x = 100;
		}
		if(typeof(options.y) == 'undefined'){
			options.y = 100;
		}
		if(typeof(options.color) == 'undefined'){
			options.color = "#ff0000";
		}
		if(typeof(options.radius) == "undefined"){
			options.radius = 30;
		}
		this.canvas = canvas;
		this.x = options.x;
		this.y = options.y;
		this.color = options.color;
		this.rotation = 1;
		this.lineWidth = 1;
		this.radius = options.radius;
		this.angle = angle;
	}

	Ball.prototype = {
		draw : function (ctx) {
			ctx.beginPath();
			ctx.strokeStyle = "#666";
			ctx.fillStyle = "#fff";
			ctx.save();
			ctx.translate(this.x,this.y);
			ctx.arc(0,0,this.radius,0,2*Math.PI,true);
			ctx.fill();
			ctx.stroke();
			ctx.restore();
			ctx.beginPath();
			ctx.arc(this.x-10,this.y-10,2,0,2*Math.PI,true);
			ctx.arc(this.x+10,this.y-10,2,0,2*Math.PI,true);
			ctx.fillStyle = "#333";
			ctx.fill();
			ctx.beginPath();
			ctx.strokeStyle = "#ff0000";
			ctx.arc(this.x,this.y,15,0.3,0.9*Math.PI,false);
			ctx.stroke();
			this.leftArm(ctx);
			this.rightArm(ctx);
			ctx.beginPath();
			ctx.strokeStyle = "#666";
			ctx.moveTo(this.x,this.y+this.radius);
			ctx.lineTo(this.x,this.y+3*this.radius);
			ctx.stroke();
			this.leftLegs(ctx);
			this.rightLegs(ctx);
			ctx.closePath();
		},
		leftArm : function (ctx) {
			/*leftArms*/
			ctx.beginPath();
			ctx.strokeStyle = "#666";
			if(this.angle%2 == 0){
				ctx.strokeStyle = "#ff0000";
			}
			ctx.lineWidth = 2;
			ctx.moveTo(this.x-10,this.y+2*this.radius);
			ctx.lineTo(this.x-20,this.y+1.5*this.radius);
			ctx.lineTo(this.x,this.y+this.radius);
			ctx.stroke();
		},
		rightArm : function (ctx) {
			/*rightArms*/
			ctx.beginPath();
			ctx.strokeStyle = "#ff0000";
			if(this.angle%2 == 0){
				ctx.strokeStyle = "#ccc";
			}
			ctx.lineWidth = 2;
			ctx.moveTo(this.x,this.y+this.radius);
			ctx.lineTo(this.x+20,this.y+1.5*this.radius);
			ctx.lineTo(this.x+30,this.y+1.5*this.radius);
			ctx.stroke();
		},
		leftLegs : function (ctx) {
			/*leftLegs*/
			ctx.beginPath();
			ctx.strokeStyle = "#ff0000";
			if(this.angle%2 == 0){
				ctx.strokeStyle = "#666";
			}
			ctx.moveTo(this.x-50,this.y+5*this.radius);
			ctx.lineTo(this.x,this.y+3*this.radius);
			//ctx.lineTo(this.x+50,this.y+5*this.radius);
			ctx.stroke();
		},
		rightLegs : function (ctx) {
			/*rightLegs*/
			ctx.beginPath();
			ctx.strokeStyle = "#666";
			if(this.angle%2 == 0){
				ctx.strokeStyle = "#ff0000";
			}
			//ctx.moveTo(this.x-50,this.y+5*this.radius);
			ctx.moveTo(this.x,this.y+3*this.radius);
			ctx.lineTo(this.x+20,this.y+4*this.radius);
			ctx.lineTo(this.x+20,this.y+4.5*this.radius);
			ctx.stroke();
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
			x : 100,
			y : 100}),
		range =1,
		speed = 1;
		context.clearRect(0, 0, canvas.width, canvas.height);
		// make ball rotate an circle
		angle += speed;
		ball.angle = angle;
		ball.y += ball.y;
		ball.x += ball.x + angle;
		if(ball.x > window.outerWidth -100){
			ball.x = window.outerWidth - 100;
		}
	  	/*walk.src = "walk0"+i+".png";
 		if(i<2){
		  	setTimeout('on()',200);
		}else{
		   i=0;
		 }*/
		ball.draw(context);
	}());
}());
