;(function($){
	$.fn.extend({
		showCharts: function(options){
			var data = new Array();//为默认数据
			var defaults = {
		        isPointType: false,
		        title : '曲线',//为图表标题
		        xAxisTitle : '通道',//为图表横坐标标题
		        yAxisTitle : '计数',//为图表纵坐标标题
		        data : data,   //为Y轴的值（数组）
		        pointIntervalData : 400,   //为默认数据长度
		        startPoint : 0,  //为开始刻度
		        endPoint : data.length,   //为结束时间
		        siteName : ['siteName1','siteName2'],  //为每条数据曲线的名称
		        unit : "nG/h"   //pop显示单位
            };
            var masterChart,
                detailChart,
                dataLen,
                newAllData = [];
            var opt = $.extend({},defaults,options);
            //检查数据最多的一条数据长度
            if(opt.data.length==1){
            	dataLen = opt.data[0].length;
            }else{
	            for(var i=0;i<opt.data.length-1;i++){
            		dataLen = opt.data[i].length>opt.data[i+1].length ? opt.data[i].length :opt.data[i+1].length;
	            }
            }
            for (var i = 0; i < opt.data.length; i++) {
                newAllData.push({
                    type: 'area',
                    name: opt.siteName[i],
                    title:opt.title,
                    data: opt.data[i]
                })
            };
            function createMaster() {
            	masterChart = $('#master-container').highcharts({
                //createDetail(masterChart)
	              	chart: {
	                    reflow: false,
	                    borderWidth: 0,
	                    backgroundColor: null,
	                    marginLeft: 50,
	                    marginRight: 20,
	                    zoomType: 'x',
	                    events: {

	                        // listen to the selection event on the master chart to update the
	                        // extremes of the detail chart
	                        selection: function(event) {
	                            var extremesObject = event.xAxis[0],
	                                min = extremesObject.min,
	                                max = extremesObject.max,
	                                detailData = [],
	                                xAxis = this.xAxis[0];
	                            // reverse engineer the last part of the data
	                            for (var i = 0; i < opt.data.length; i++) {
                                    detailData.push([]);
                                }

	                            for (var j = 0; j < opt.data.length; j++) {
                                    jQuery.each(this.series[j].data, function(i, point) {
                                        if (point.x > min && point.x < max) {
                                            detailData[j].push({
                                                x: point.x,
                                                y: point.y
                                            });
                                        }
                                    });
                                };

	                            // move the plot bands to reflect the new detail span
	                            xAxis.removePlotBand('mask-before');
	                            xAxis.addPlotBand({
	                                id: 'mask-before',
	                                from: 0,
	                                to: min,
	                                color: 'rgba(0, 0, 0, 0.2)'
	                            });

	                            xAxis.removePlotBand('mask-after');
	                            xAxis.addPlotBand({
	                                id: 'mask-after',
	                                from: max,
	                                to: Date.UTC(2008, 11, 31),
	                                color: 'rgba(0, 0, 0, 0.2)'
	                            });


	                            for (var i = 0; i < opt.data.length; i++) {
                                    detailChart.series[i].setData(detailData[i]);
                                }

	                            return false;
	                        }
	                    }
	                },
	                title: {
	                    text: null
	                },
	                xAxis: {
	                    type: 'spline',
	                    showLastTickLabel: true,
	                    plotBands: [{
	                        id: 'mask-before',
	                        from: 0,
	                        to: dataLen-opt.pointIntervalData,
	                        color: 'rgba(0, 0, 0, 0.2)'
	                    },{
	                        id: 'mask-after',
	                        from: dataLen,
	                        to:dataLen+10,
	                        color: 'rgba(0, 0, 0, 0.2)'
	                    }],
	                    title: {
	                        text: null
	                    }
	                },
	                yAxis: {
	                    gridLineWidth: 0,
	                    labels: {
	                        enabled: false
	                    },
	                    title: {
	                        text: null
	                    },
	                    min: 0,
	                    showFirstLabel: false
	                },
	                tooltip: {
	                    formatter: function() {
	                        return false;
	                    }
	                },
	                legend: {
	                    enabled: true,
			            align: 'center',
			            verticalAlign: 'bottom',
			            borderWidth: 0
	                },
	                credits: {
	                    enabled: false
	                },
	                plotOptions: {
	                    series: {
	                        fillColor: {
	                            linearGradient: [0, 0, 0, 70],
	                            stops: [
	                                [0, '#4572A7'],
	                                [1, 'rgba(0,0,0,0)']
	                            ]
	                        },
	                        lineWidth: 1,
	                        marker: {
	                            enabled: false
	                        },
	                        shadow: false,
	                        states: {
	                            hover: {
	                                lineWidth: 1
	                            }
	                        },
	                        enableMouseTracking: false
	                    }
	                },

	                series: newAllData,

	                exporting: {
	                    enabled: false
	                }
           		}, function(masterChart) {
            		createDetail(masterChart)
                })
                .highcharts(); // return chart instance
            }

            // create the detail chart

            function createDetail(masterChart) {
                // prepare the detail chart
                var detailData = [],
                detailStart = dataLen-opt.pointIntervalData,
    			detailSeries = [];
                for (var i = 0; i < opt.data.length; i++) {
                    detailData.push([])
                };
                for (var j = 0; j < opt.data.length; j++) {
                    jQuery.each(masterChart.series[j].data, function(i, point) {
                        if (point.x >= detailStart) {
                            detailData[j].push({
                                y : point.y,
                                x : point.x
                            })
                        }
                    });
                };
                for (var i = 0; i < opt.data.length; i++) {
                    detailSeries.push({
                        name: opt.siteName[i],
                        pointStart: detailStart,
                        pointInterval: opt.pointIntervalData,
                        data: detailData[i],
                        turboThreshold: 0
                    })
                };
                detailChart = $('#detail-container').highcharts({
                	chart: {
	                    marginBottom: 120,
	                    reflow: false,
	                    marginRight: 20,
	                    style: {
	                        position: 'absolute'
	                    }
	                },
	                credits: {
	                    enabled: false
	                },
	                title: {
	                    text: opt.title
	                },
	                xAxis: {
	                    type: 'spline',
	                },
	                yAxis: {
	                    title: {
	                        text: opt.yAxisTitle
	                    },
	                    maxZoom: 0.1,
	                    min:0
	                },
	                tooltip: {
	                    formatter: function() {
                            var str = '';
                            switch(opt.unit.toLowerCase().trim())
                            {
                                case "ugy/h":
                                case "gy/h":
                                case "bq/m3":
                                    str += "<br/>剂量率:<br/>"; break;
                                case "°c": str += "<br/>温度:<br/>"; break;
                                case "mm/m3":
                                    str += "<br/>雨量:<br/>"; break;
                                case "度":
                                    str += "<br/>风向:<br/>"; break;
                                case "m/s":
                                    str += "<br/>风速:<br/>"; break;
                            }

                            for (var i = 0; i < this.points.length; i++) {
                                str += '<b>' + this.points[i].series.name + '</b><br>'
                                str += '<p>'+opt.xAxisTitle+':' +this.points[i].x +'</p><br>'
                                str += '<p>'+opt.yAxisTitle+'：'+this.points[i].y+opt.unit+'</p><br>';
                            }
                            return str;
                        },
                        shared: true
	                },
	                legend: {
	                   enabled: false
	                },
	                plotOptions: {
	                    series: {
	                        marker: {
	                            enabled: false,
	                            states: {
	                                hover: {
	                                    enabled: true,
	                                    radius: 3
	                                }
	                            }
	                        }
	                    }
	                },
	                series: detailSeries,

	                exporting: {
	                    enabled: false
	                }
                }).highcharts(); // return chart
            }

            // make the container smaller and add a second container for the master chart
            var $container = this
                .css('position', 'relative');

            var $detailContainer = $('<div id="detail-container">')
                .appendTo($container);

            var $masterContainer = $('<div id="master-container">')
                .css({ position: 'absolute', top: 300, height: 120, width: '100%' })
                .appendTo($container);

            // create master and in its callback, create the detail chart
    		createMaster();
            return Highcharts.getOptions().colors.slice(0,opt.data.length);
        }
	})
}(jQuery));
