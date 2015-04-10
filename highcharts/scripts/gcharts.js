;(function($) {
    $.fn.extend({
        showCharts: function(options) {
            
            var data1 = new Array([1,2,3,4,5,6,7,5,6,7,7,8,8,8,9]);
            var defaults = {
                title : '曲线',//为图表标题
                xAxisTitle : '通道',//为为图表横坐标标题
                yAxisTitle : '为Y轴',//为为为图表纵坐标标题
                xAxisMinRange :1023,//为为为为x轴取值范围
                isPointType: false,
                data : data1,   //为Y轴的值（数组）
                pointIntervalData : 8,   //为间隔多长时间为一个点
                startPonit: 0,  //为开始时间
                endPoint : data1.length,   //为结束时间
                siteName : ["name1"],  //为每条数据曲线的名称
                unit: "uGy/H",   //pop显示单位
                precision: 2
            };
            var opt = $.extend({}, defaults, options);
            var data = opt.data[0];
            var masterChart,
                detailChart,
                defaultValue,
                defaultArr,
                isOneData = false;
            if (opt.data && opt.data[0].length == 1) {
                isOneData = true;
            };
            // create the master chart

            defaultArr = data.concat();
            defaultValue = defaultArr.slice(-parseInt((defaultArr.length/8)));
            function createMaster() {
                masterChart = $('#master-container').highcharts({
                    chart: {
                        reflow: false,
                        borderWidth: 0,
                        backgroundColor: null,
                        marginLeft: 50,
                        marginRight: 20,
                        zoomType: 'x',
                        height:80,
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
                                jQuery.each(this.series[0].data, function(i, point) {
                                    if (point.x > min && point.x < max) {
                                        detailData.push({
                                            x: point.x,
                                            y: point.y
                                        });
                                    }
                                });
        
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
                                    to: data.length,
                                    color: 'rgba(0, 0, 0, 0.2)'
                                });
        
        
                                detailChart.series[0].setData(detailData);
        
                                return false;
                            },
                            load:function(event){
                                var xAxis = this.xAxis[0];
                                // move the plot bands to reflect the new detail span
                                xAxis.removePlotBand('mask-before');
                                xAxis.addPlotBand({
                                    id: 'mask-before',
                                    from: 0,
                                    to: parseInt(data.length - data.length/8),
                                    color: 'rgba(0, 0, 0, 0.2)'
                                });
                                xAxis.removePlotBand('mask-after');
                                xAxis.addPlotBand({
                                    id: 'mask-after',
                                    from: parseInt(data.length - data.length/8)+defaultValue.length,
                                    to: data.length,
                                    color: 'rgba(0, 0, 0, 0.2)'
                                });
        
                            }
                        }
                    },
                    title: {
                        text: null
                    },
                    xAxis: {
                        //type: 'datetime',
                        showLastTickLabel: true,
                        //maxZoom: 14 * 24 * 3600000, // fourteen days
                        plotBands: [{
                            id: 'mask-before',
                            from:0,
                            to:data.length,
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
                        min: 0.6,
                        showFirstLabel: false
                    },
                    tooltip: {
                        formatter: function() {
                            return false;
                        }
                    },
                    legend: {
                        enabled: false
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
        
                    series: [{
                        type: 'area',
                        //name: 'USD to EUR',
                        //pointInterval: data.length*(1/8),
                        pointStart: 0,
                        data: data
                    }],
        
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
                    detailStart = 0;
                defaultArr = masterChart.series[0].data.concat();//初始数据
                defaultValue = defaultArr.slice(-parseInt((defaultArr.length/8)));
                jQuery.each(defaultValue, function(i, point) {
                    if (point.x >= detailStart) {
                        detailData.push(point.y);
                    }
                });
        
                // create a detail chart referenced by a global variable
                detailChart = $('#detail-container').highcharts({
                    chart: {
                        marginBottom: 120,
                        reflow: false,
                        marginLeft: 50,
                        marginRight: 20,
                        style: {
                            position: 'absolute'
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: null
                    },
                    xAxis: {
                       // type: 'datetime'
                    },
                    yAxis: {
                        title: {
                            text: null
                        },
                        maxZoom: 0.1
                    },
                    tooltip: {
                        formatter: function() {
                            //var point = this.points[0];
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
                                str +='<b>'+opt.xAxisTitle+':</b>'+ this.points[i].x;
                                str += '<br/><b>'+opt.yAxisTitle+':</b>' + Highcharts.numberFormat(this.points[i].y, opt.precision) + " " + opt.unit;
                            }
                            return  str;
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
                    series: [{
                        //name: 'USD to EUR',
                        pointStart: parseInt((defaultArr.length-defaultArr.length/10)),
                       // pointInterval: 1/10,
                        data: detailData
                    }],
        
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
                .css({ position: 'absolute', top: 300, height: 80, width: '100%' })
                .appendTo($container);

            // create master and in its callback, create the detail chart
            createMaster();
            return Highcharts.getOptions().colors.slice(0,opt.data.length);
        },
        //实时动态曲线图
        //obj为DOM对象
        //initialData为初始的20条数据
        //dynamitPoint为动态点
        dynamicChart: function(initialData, dynamitPoint) {
            Highcharts.setOptions({
                global: {
                    useUTC: false
                }
            });
            var chart;  
            this.highcharts({
                chart: {
                    type: 'spline',
                    animation: Highcharts.svg, // don't animate in old IE               
                    marginRight: 10,
                    events: {
                        load: function() {
                            var series = this.series[0]
                            setInterval(function() {
                                var x = dynamitPoint[0], // current time         
                                    y = dynamitPoint[1];
                                series.addPoint([x, y], true, true);
                            }, 1000);
                        }
                    }
                },
                title: {
                    text: ''
                },
                xAxis: {
                    type: 'datetime',
                    tickPixelInterval: 150
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    formatter: function() {
                        return '<b>' + this.series.name + '</b><br/>' +
                            Highcharts.dateFormat('时间:%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                            Highcharts.numberFormat(this.y, 2);
                    }
                },
                legend: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                series: [{
                    name: '数据值',
                    data: initialData
                }]
            });
        },
        showVerticalCharts : function(options){ 
            var data1 = new Array([144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2],[106.0, 176.0, 106.6, 148.5, 106.4, 106.1, 95.6, 54.4, 106.9, 71.5, 106.4, 129.2]);
            var defaults = {
                title : '曲线',//为图表标题
                xAxisTitle : '通道',//为为图表横坐标标题
                yAxisTitle : '为Y轴',//为为为图表纵坐标标题
                xAxisMinRange :1023,//为为为为x轴取值范围
                isPointType: false,
                data : data1,   //为Y轴的值（数组）
                pointIntervalData : 24 * 3600 * 1000,   //为间隔多长时间为一个点
                startPonit: Date.UTC(2005, 0, 01),  //为开始时间
                endTime : Date.UTC(2006, 11, 31),   //为结束时间
                siteName : ["name1"],  //为每条数据曲线的名称
                unit: "uGy/H",   //pop显示单位
                precision: 2
            };
            var opt = $.extend({},defaults,options);
            Highcharts.setOptions({
                global: {
                    useUTC: false
                }
            });
            var charts = {
                chart: {
                    type: 'spline'
                },
                title: {
                    text: opt.title,
                    x: -20 //center
                },
                xAxis: {
                    title : {
                        text : opt.xAxisTitle
                    },
                    //allowDecimals:false ,
                    /*categories:(function(){
                        var arr;
                        for(var i=0;i<5;i++){
                            arr = i;
                        }
                        return arr;
                    }()),*/
                    min:0,
                    minRange: opt.xAxisMinRange
                },
                yAxis: {
                    title: {
                        text: opt.yAxisTitle
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    //valueSuffix: '',
                    formatter: function() {
                        //var point = this.points[0];
                        var str = '';
                        switch(opt.unit.toLowerCase().trim()){
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
                        str += '<br/><b>' + this.point.series.name + '：</b>' + Highcharts.numberFormat(this.y, opt.precision) + " " + opt.unit;
                        return Highcharts.dateFormat('时间:%Y-%m-%d %H:%M:%S', this.x) + str;
                    }
                },
                plotOptions:{
                    series:{
                        step:'left'
                    }
                },
                legend: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                series: []
                
            }
            charts.series = new Array();
            if(opt.data.length>0){
                for(var i=0;i<opt.data.length;i++){
                    charts.series[i] = new Object();
                    charts.series[i].data = opt.data[i];
                }
            }
            this.highcharts(charts);

        }
    });
})(jQuery);