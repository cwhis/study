/**
*@author caiwenhua
*@date 2014/12/01
*
*/
;(function(){
	function Slide (){
		var oUl = this.getId('slide'),
		oUlCopy = this.getId('slide1'),
		that = this;
		this.oUl = oUl;
		this.oUlCopy = oUlCopy;
		this.oLi = $('li',this.oUl);
		this.oImg = $('li img',this.oUl);
		this.oWidth = this.getLiWidth(oUl);
		this.len = this.oLi.length;
		$(oUl).css('width',this.len*this.oWidth);
		$(oUlCopy).css('width',this.len*this.oWidth);
		$(oUlCopy).css('left',this.len*this.oWidth);
		this.index = 0;
		this.maxMove = false;
		this.minIndex = 0;
		this.timer = null;
		that.move(that.oUl);
	}
	Slide.prototype = {
		getId : function(id){
			return document.getElementById(id);
		},
		getLiWidth : function(obj){
			var that = this,
			oWidth = 2*parseInt(that.oLi.css('padding'))+parseInt(that.oImg.css('width'));
			return oWidth;
		},
		move : function(obj){
			var that = this,
			index = 0,
			moveObj = $(obj);
			window.clearInterval(that.timer);
			that.oUlCopy.innerHTML = obj.innerHTML;
			that.timer = window.setInterval(function(){
				index = that.index--;
				that.startMove(moveObj,index);	
			},100);
		},
		startMove : function(obj,index){
			var that = this;
			obj.css('left',index);
			$(that.oUlCopy).css('left',that.len*that.oWidth+index);
			if(-index >= parseInt(obj.css('width'))){
				that.index = 0;
			}
		}
	}
	var slide = new Slide();
}(jQuery));