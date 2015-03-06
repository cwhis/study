(function ($) {
	$.extend({
		showCharts : function(options){
			var charts = {
				title: {
				    text: options.title,
				    x: -20 //center
				},
				xAxis: {
					title : {
						text : options.xAxisTitle
					},
					allowDecimals:false ,
					/*categories:(function(){
						var arr;
						for(var i=0;i<5;i++){
							arr = i;
						}
						return arr;
					}()),*/
					min:0,
					minRange: options.xAxisMinRange
				},
				yAxis: {
				    title: {
				        text: options.yAxisTitle
				    },
				    plotLines: [{
				        value: 0,
				        width: 1,
				        color: '#808080'
				    }]
				},
				tooltip: {
				    valueSuffix: ''
				},
				legend: {
				    layout: options.legend.layout,
				    align: options.legend.align,
				    verticalAlign: options.legend.verticalAlign,
				    borderWidth: options.legend.borderWidth
				},
				series: []
			}
			charts.series = new Array();
			var datas = options.datas;
			var dataCopy = new Array();
			if(datas.length>0){
				for(var n=0;n<datas.length;n++){
            		charts.series[n] = new Object();
					charts.series[n].name = datas[n].name;
					var data = datas[n].data;
					charts.series[n].data = (function() {
						for(var i=0;i<data.length;i++){
							data[i].marker = {enabled:false};
							(function(m){
								if(m<(data.length-1)&&data[m].y != data[m+1].y){
									dataCopy.push(data[m]);
									dataCopy.push({x:data[m].x,y:data[m+1].y,marker:{enabled:false}})
								}else{
									dataCopy.push(data[m]);

								}
							}(i));
						}
						return dataCopy;
					})();
				}
			}
			$('#'+options.domId).highcharts(charts);
		},
		showVerticalCharts : function(options){
			var charts = {
				title: {
				    text: options.title,
				    x: -20 //center
				},
				xAxis: {
					title : {
						text : options.xAxisTitle
					},
					allowDecimals:false ,
					min:0,
					minRange: 50
				},
				yAxis: {
				    title: {
				        text: options.yAxisTitle
				    },
				    plotLines: [{
				        value: 0,
				        width: 1,
				        color: '#808080'
				    }]
				},
				tooltip: {
				    valueSuffix: ''
				},
				legend: {
				    layout: options.legend.layout,
				    align: options.legend.align,
				    verticalAlign: options.legend.verticalAlign,
				    borderWidth: options.legend.borderWidth
				},
				series: []
			}
			charts.series = new Array();
			var datas = options.datas;
			var dataCopy = new Array();
			if(datas.length>0){
				for(var n=0;n<datas.length;n++){
            		charts.series[n] = new Object();
					charts.series[n].name = datas[n].name;
					var data = datas[n].data;
					charts.series[n].data = (function() {
						for(var i=0;i<data.length;i++){
							data[i].marker = {enabled:false};
							dataCopy.push(data[i]);
						}
						return dataCopy;
					})();
				}
			}
			$('#'+options.domId).highcharts(charts);
		}
	});
}(jQuery));