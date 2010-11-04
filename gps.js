function gpsPlane(divId){
   Raphael.el.selected = function(){
      this.selected;
   };
   var planeSize = 1000;
   var pointSize = 10;
   var pointOpacity = .6;
   var plane = Raphael(divId, planeSize, planeSize);
   var selectedPointArray = [];
   var numSelectedPoints = 0;

   var fillRed = function(){
      this.attr({fill: "red"});
   };
   
   var start = function(){
      this.ox = this.attr("cx");
      this.oy = this.attr("cy");
      this.attr({opacity: 1});
   },
   move = function(dx, dy){
      this.attr({cx: this.ox + dx, cy: this.oy + dy});
   },
   up = function(){
      this.attr({opacity: pointOpacity});
   }
   

   this.init = function(){
      /*since raphael apparently doesn't handle arbitrary clicks,
      only clicks on raphael objects, we'll make a grid of squares
      to catch the click events.
      click events onto the grid will only make points.
      all other clicks are handled by the objects themselves.
      */      
      for(var i=0; i<planeSize; i+= 100){
	 for(var j=0; j<planeSize; j += 100){
	    var point = plane.rect(i, j, 100, 100);
	    point.attr({fill: "white", stroke: "white"});
	    //point.hide();
	    point.click(function(e){
	       var c = plane.circle(e.pageX, e.pageY, pointSize);
	       c.attr({fill: "black", opacity: pointOpacity});
	       c.selected = 0;
	       c.dblclick(function(e){
		  if(this.selected === 0){
		     this.attr({fill: "red"});
		     this.selected = 1;
		     numSelectedPoints += 1;
		  }
		  else if(this.selected === 1){
		     this.attr({fill: "black"});
		     this.selected = 0;
		     numSelectedPoints -= 1;
		  }
	       });
	       c.drag(move, start, up); 
	    });
	 }
      }

      /* here is where we'll want to draw our icons
      */

   }
}
