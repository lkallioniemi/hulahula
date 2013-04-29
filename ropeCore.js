(function() { 
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById("RopeDrawingArea");
	canvas.width = document.width;
	canvas.height = document.height;
var context = canvas.getContext('2d');
var radius = 100;
var centerx, centery;
var friction = 0.95;
var mousex, mousey;
var itemx, itemy;

var ropeDemo = {
	rope: { items: [],},

	DrawOverride: function () {
		context.clearRect(0, 0, document.width, document.height);
	
		//context.fillRect( ropeDemo.rope.items[1].x - 3 + document.width * 0.5, ropeDemo.rope.items[1].y - 3 + document.height * 0.5, +6, +6);
		context.beginPath();
		//context.moveTo(centerx + document.width * 0.5, centery + document.height * 0.5);
		//context.lineTo(ropeDemo.rope.items[1].x + document.width * 0.5, ropeDemo.rope.items[1].y + document.height * 0.5);
		context.arc(ropeDemo.rope.items[1].x + document.width * 0.5, ropeDemo.rope.items[1].y + document.height * 0.5, radius, 0, 2*Math.PI);

		context.stroke();
		context.closePath();
	},

	ThinkOverride: function () {
		centerx = mousex - document.width * 0.5;
		centery = mousey - document.height * 0.5;
		// Apply verlet integration
		var item = ropeDemo.rope.items[1];

		var old_x = item.x;
		var old_y = item.y;

		item.x = (2 * item.x - item.old_x); // No acceleration here
		item.y = (2 * item.y - item.old_y); // No acceleration here

		item.old_x = old_x;
		item.old_y = old_y;

		// Apply relaxation
		var dx = item.x - centerx;
		var dy = item.y - centery;

		var dstFrom = Math.sqrt(dx * dx + dy * dy);

		if (dstFrom > radius && dstFrom != 0) {
			item.x -= (dstFrom - radius) * (dx / dstFrom) * 0.5;
			item.y -= (dstFrom - radius) * (dy / dstFrom) * 0.5;
		}
	},

	Step: function () {
		ropeDemo.ThinkOverride();
		ropeDemo.DrawOverride();
		requestAnimationFrame(ropeDemo.Step);
	},

	Initialize: function () {
		if (window.DeviceMotionEvent) {
			window.addEventListener('devicemotion', function(event){
					mousex = event.acceleration.x;
					mousey = event.acceleration.y;
					//var acceleration_z = event.acceleration.z;
				
			}, false);
		} else {
			window.onmousemove = function (e) {
				if (e.offsetX) {
					mousex = e.offsetX;
					mousey = e.offsetY;
				} else if (e.layerX) {
					mousex = e.layerX;
					mousey = e.layerY;
				}
			};
		};
		
		

		// Start application
		ropeDemo.rope.items[0] = { x: 0, y: 0, old_x: 0, old_y: +0 };
		ropeDemo.rope.items[1] = { x: 0, y: 0, old_x: 0, old_y: +0 };
		ropeDemo.Step();
	}
};

window.onload = ropeDemo.Initialize();
