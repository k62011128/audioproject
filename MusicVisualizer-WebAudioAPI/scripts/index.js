function $(s) {
	return document.querySelectorAll(s);
}

var size = 256; //定义的音频数组长度
var box = $('.right')[0];
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var line; //渐变色变量
box.appendChild(canvas);
var height, width;
var Dots = []; //用于存放点对象数组,点的坐标和颜色信息

var po = $("#au")[0];

var mv = new Musicvisualizer({
	size: size,
	draw: draw
});

var typeli = $(".type li");
for (var i = 0; i < typeli.length; i++) {
	typeli[i].onclick = function () {
		for (var j = 0; j < typeli.length; j++) {
			typeli[j].className = "";
		}
		this.className = "selectedType";
		draw.type = this.getAttribute("data-type");
	}
}

function getRandom(m, n) {
	return Math.round(Math.random() * (n - m) + m);
}

function getDots() {
	Dots = [];
	for (var i = 0; i < size; i++) {
		var DotX = getRandom(0, width);
		var DotY = getRandom(0, height);
		// rgba 增加透明度  最边缘透明度为0
		var DotColor = "rgba(" + getRandom(0, 255) + "," + getRandom(0, 255) + "," + getRandom(0, 255) + ",0.6)";
		Dots.push({
			x: DotX,
			y: DotY,
			color: DotColor,
			dx: getRandom(-3, 3),
			dy: getRandom(-3, 3),
			ch: 1
		});
	}
}

/**
 * [resize 根据窗口大小改变canvas画布大小]
 * @return {[type]} [description]
 */
function resize() {
	height = box.clientHeight;
	width = box.clientWidth;
	canvas.width = width;
	canvas.height = height;

	getDots();
}
resize();
window.onresize = resize;

var eX = 1,
	eY = 1,
	canvasX, canvasY, flag = 0
var tmpr = 29,
	pre = -1

canvas.addEventListener('mousemove', (e) => {
	var cRect = canvas.getBoundingClientRect();
	canvasX = Math.round(e.clientX - cRect.left);
	canvasY = Math.round(e.clientY - cRect.top);
	eX = e.clientX;
	eY = e.clientY;
})
canvas.addEventListener('mousewheel', (e) => {
	if (e.deltaY > 0) {
		if (tmpr + 4 < 100) {
			tmpr += 4
		}
	} else {
		if (tmpr - 4 > 0) {
			tmpr -= 4
		}
	}
})
var cnt = 0
canvas.addEventListener('click', (e) => {
	flag ^= 1
	if (flag === 0) {
		pre = tmpr
		tmpr = 1
		//这里加出现音效
		if (po.paused) {
			po.volume = 1
			po.play()
		}
		var interval = setInterval(() => {
			run()
			if (cnt === size - 1) {
				clearInterval(interval)
				var interval2 = setInterval(() => {
					if (po.volume > 0) {
						po.volume -= 0.125
					}
					if (po.volume - 0 < 0.01) {
						clearInterval(interval2)
						po.pause()
						po.volume = 1
						po.currentTime = 0
					}
				}, 250)
			}
		}, 25)

	} else {
		// clearInterval(interval)
		if (pre != -1) {
			tmpr = pre
		}
		clearInterval(interval)
		var interval2 = setInterval(() => {
			if (po.volume > 0) {
				po.volume -= 0.125
			}
			if (po.volume - 0 < 0.01) {
				clearInterval(interval2)
				po.pause()
				po.volume = 1
				po.currentTime = 0
			}
		}, 250)

	}
})

function judge(x, y, r, x2, y2, r2) {
	if (flag && (Math.abs(x - x2) * Math.abs(x - x2) + Math.abs(y - y2) * Math.abs(y - y2)) < Math.abs(r - r2) * Math.abs(r - r2)) {
		//这里加吸收音效
		return 0
	}
	return 1
}

// function judge2(x, y, r, x2, y2, r2) {
// 	if (Math.abs(x - x2) * Math.abs(x - x2) + Math.abs(y - y2) * Math.abs(y - y2) < Math.abs(r + r2 + 50) * Math.abs(r + r2 + 50)) {
// 		return 1
// 	}
// 	return 0
// }

function run() {
	for (let i = 0; i < size; i++) {
		cnt = i
		if (Dots[i].ch === 0) {
			Dots[i].ch = 1;
			return;
		}
	}
}
ctx.lineWidth = 1;
function draw(arr) {
	ctx.clearRect(0, 0, width, height); //每次绘制时，清空上次画布内容
	ctx.beginPath()
	ctx.strokeStyle = 'rgba(255,251,240,0.1)'
	ctx.arc(eX, eY, tmpr, 0, 2 * Math.PI)
	ctx.stroke()
	var lir = ctx.createRadialGradient(eX, eY, 0, eX, eY, tmpr)
	let D2 = "rgba(" + getRandom(0, 255) + "," + getRandom(0, 255) + "," + getRandom(0, 255) + ",0.5)";
	lir.addColorStop(0, D2); //内部
	lir.addColorStop(1, 'rgba(255,251,240,0.01)');
	ctx.fillStyle = lir
	ctx.fill()
	for (let i = 0; i < size; i++) {
		let o = Dots[i];
		if (Dots[i].ch === 0) {
			Dots[i].x = eX + getRandom(-3, 3);
			Dots[i].y = eY + getRandom(-3, 3);
			Dots[i].dx = getRandom(-3, 3);
			while (Dots[i].dx === 0) {
				Dots[i].dx = getRandom(-3, 3);
			}
			Dots[i].dy = getRandom(-3, 3);
			while (Dots[i].dy === 0) {
				Dots[i].dy = getRandom(-3, 3);
			}
		}
		// else if (judge2(eX, eY, tmpr, o.x, o.y, r)) {
		// 	ctx.beginPath();
		// 	ctx.strokeStyle = '#fff'
		// 	ctx.moveTo(eX, eY)
		// 	ctx.lineTo(o.X, o.Y)
		// 	ctx.closePath()
		// 	ctx.stroke()

		// }
		if (draw.type == "dot") {
			ctx.beginPath(); //声明，防止各个圆之间连线起来
			var r = 12 + (arr[i]) / 4; //圆的半径 最小10px,并且半径大小会依赖屏幕的宽度大小
			ctx.arc(o.x, o.y, r, 0, Math.PI * 2, true); //x,y,半径，起始角度，绘制角度，是否逆时针
			var round = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, r); //从圆心到圆最外围
			round.addColorStop(1, 'rgba(255,251,240,0.8)');
			let DC = "rgba(" + getRandom(0, 255) + "," + getRandom(0, 255) + "," + getRandom(0, 255) + ",0.6)";
			if (i % 4 === 0) {
				// round.addColorStop(0, DC);
				round.addColorStop(0, o.color);
			} else {
				round.addColorStop(0, o.color);
			}
			ctx.fillStyle = round;
			if (judge(eX, eY, tmpr, o.x, o.y, r) && Dots[i].ch) {
				ctx.fill();
				while (o.dx === 0) {
					o.dx = getRandom(-3, 3);
				}
				while (o.dy === 0) {
					o.dy = getRandom(-3, 3);
				}
				o.x += o.dx;
				o.y += o.dy;
				if (o.x > width) {
					o.dx = -o.dx;
					o.x = o.x - 2 * (o.x - width);
				}
				if (o.x < 0) {
					o.dx = -o.dx;
					o.x = o.x + 2 * (0 - o.x);
				}
				if (o.y > height) {
					o.dy = -o.dy;
					o.y = o.y - 2 * (o.y - height);
				}
				if (o.y < 0) {
					o.dy = -o.dy;
					o.y = o.y + 2 * (0 - o.y);
				}
			} else {

				if (Dots[i].ch) {
					Dots[i].ch = 0;
				}
				Dots[i].x = eX + getRandom(-3, 3);
				Dots[i].y = eY + getRandom(-3, 3);
				Dots[i].dx = getRandom(-3, 3);
				while (Dots[i].dx === 0) {
					Dots[i].dx = getRandom(-3, 3);
				}
				Dots[i].dy = getRandom(-3, 3);
				while (Dots[i].dy === 0) {
					Dots[i].dy = getRandom(-3, 3);
				}
			}
            ctx.closePath()
		}

	}
}
draw.type = "dot"; //默认显示效果类型
//==============================================
$("#btn")[0].onclick = function () {
	$("#loadfile")[0].click();
}

$("#loadfile")[0].onchange = function () {
	var file = this.files[0];
	var fr = new FileReader();
	fr.readAsArrayBuffer(file);
	// $("#loadfile")[0].value = '';
	fr.onload = function (e) {
		// 重写play方法  这边e.target.result已经是arraybuffer对象类型，不再是ajax路径读入
		mv.play(e.target.result);
	}
	$("#hhh")[0].style = "display:none"
}