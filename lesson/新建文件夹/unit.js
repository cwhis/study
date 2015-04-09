;(function($){
	function Init(){
		var that = this;
		$.onload = function(){
			var obj =  document.getElementById('demo');
			that.working(obj);
		}
	}
	Init.prototype = {
		working : function(obj){
			var that = this;
			obj.onmouseover = function(){
				that.startMove(obj,iTarget);
			}
			obj.onmouseout = function(){
				that.startMove(obj,iTarget);
			}
		},
		startMove : function(obj,iTarget){

		}

	}
	$.init = new Init();
}('window'));