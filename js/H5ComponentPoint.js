/*散点图组件对象*/

var H5ComponentPoint = function (name, cfg) {
	var component = new H5ComponentBase(name, cfg);	

	var base = cfg.data[0][1]; //以第一个数据的比例为大小的100%

	//	输出每个 point
	$.each( cfg.data, function(index, item) {
		var point = $('<div class="point point_'+ index +'">');

		var name = $('<div class="name">'+ item[0] +'</div>')
		var rate = $('<div class="rate">'+ (item[1]*100) + '%' +'</div>')

		name.append(rate);
		point.append(name);

		var per = (item[1] / base * 100) + '%';
		point.width(per).height(per);

		if(item[2])	{
			point.css('backgroundColor', item[2]);
		}

		if(item[3] !== undefined && item[4] !== undefined )	{
			point.css({
				left: item[3],
				top: item[4]
			});
			//暂存left、top到元素上
			point.data('left', item[3]).data('top', item[4]);
		}

		// 设置zIndex、重设位置
		point.css('zIndex', 100-index);
		point.css('left', 0).css('top', 0);


		point.css('transition', 'all 1s ' + index*0.5 + 's');
		component.append( point );
	} );

	//onLoad之后去除暂存的left、top 并且附加到CSS中
	component.on('onLoad', function () {
		component.find('.point').each(function (index, item) {
			$(item).css('left', $(item).data('left')).css('top', $(item).data('top'));
		});
	});

	//onLeave 之后，还原初始的位置
	component.on('onLeave', function () {
		component.find('.point').each(function (index, item) {
			$(item).css('left', 0).css('top', 0);
		});
	});

	component.find('.point').on('click',function(){

	    component.find('.point').removeClass('point_focus');
	    $(this).addClass('point_focus');

	    return false;
	}).eq(0).addClass('point_focus')


	return component;
};
