/*折线图组件对象*/

var H5ComponentPolyline = function (name, cfg) {
	var component = new H5ComponentBase(name, cfg);	

	//	绘制网格线
	var w = cfg.width;
	var h = cfg.height;

	//加入一个画布（网格线背景） ---背景层
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	component.append(cns);

	//水平网格线 100 份 --> 10 份
	var step_x = 10;
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#aaa";

	window.ctx = ctx;
	for (var i = 0; i <= step_x; i++) {
		var y = (h / step_x) *i;
		ctx.moveTo(0, y);
		ctx.lineTo(w, y);	
	}
	
	//垂直网格线
	var step_v = cfg.data.length+1;
	var text_w = w / step_v >> 0;

	for (var i = 0; i <= step_v; i++) {
		var x = (w / step_v)*i;
		ctx.moveTo(x, 0);
		ctx.lineTo(x, h);	

		if (cfg.data[i]) {
			var myText = $('<div class="myText"></div>');
			myText.text(cfg.data[i][0]);
			myText.css('width', text_w).css('left', x/2);

			component.append(myText);
		} 
	}

	ctx.stroke();

	//加入一个画布（网格线背景） ---数据层
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	component.append(cns);

	


	/**
	*	绘制折线以及对应的数据的阴影
	*	@param  {float} per 0到1之间的数据，会根据这个值绘制最终数据对应的中间状态
	*	@return {DOM} component 
	*
	*/

	var draw = function (per) {

		// 清空画布
		ctx.clearRect(0, 0, w, h);
		//绘制折线数据
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.strokeStyle = "#ff8878";

		var x = 0;
		var y = 0;
		var row_w = (w / (cfg.data.length+1)) ;
		//画点
		for (var i = 0; i < cfg.data.length; i++) {
			var item = cfg.data[i] ;

			x = row_w * (i+1);
			y = h - (item[1]*h*per);

			ctx.moveTo(x, y);
			ctx.arc(x, y, 5, 0, 2*Math.PI);	
		}
		//连线
		//移动画笔到第一个点的位置

		ctx.moveTo(row_w, h-(cfg.data[0][1]*h*per));
		for (var i = 0; i < cfg.data.length; i++) {
			var item = cfg.data[i] ;
			x = row_w * (i+1);
			y = h - (item[1]*h*per);
			ctx.lineTo(x, y);
		}

		ctx.stroke();

		ctx.strokeStyle = 'rgba(255, 136, 120, 0)';
		//绘制阴影
		ctx.lineTo(x, h);
		ctx.lineTo(row_w, h);
		ctx.fillStyle = 'rgba(255, 136, 120, 0.20)';
		ctx.fill();

		//写数据
		for (var i = 0; i < cfg.data.length; i++) {
			var item = cfg.data[i] ;

			x = row_w * (i+1);
			y = h - (item[1]*h*per);
			ctx.fillStyle = item[2] ? item[2] : '#595959';

			ctx.fillText((item[1]*100>>0)+'%', x-10, y-10);
		}
	}	


	component.on('onLoad', function (){
		//数据生长动画
		var s= 0;
		for (var i = 0; i < 100; i++) {
			setTimeout(function(){
				s+=.01;
				draw(s);
			}, i*10+500);
		}
	});

	component.on('onLeave', function (){
		//数据生长动画
		var s= 1;
		for (var i = 0; i < 100; i++) {
			setTimeout(function(){
				s-=.01;
				draw(s);
			}, i*10);
		}
	});

	return component;
};

