/**
*@author caiwenhua
*@date 2014/12/02 09:20
*
*/
;(function(){
	function imgSwitch (){
		this.oUl = $('#imgSwitch');
		this.oImg = $('#demo img');
		this.oLi = $('li',this.oUl);
		this.switchs(this.oImg);
		this.index = 0;
	}
	imgSwitch.prototype = {
		switchs : function(objImg){
			var that = this;
			for(var i=0;i<that.oLi.length;i++){
				that.oLi.index = i;
				$(that.oLi[i]).click(function(){
					$(that.oLi).removeClass('cur');
					$(this).addClass('cur');
					objImg.attr('src',$('img',this).attr('src'));
				});
			}
		}
	}
	var imgswitchs = new imgSwitch();
}(jQuery));