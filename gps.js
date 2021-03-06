function gpsPlane(divId){
	//add new fields to raphaej elements
	//not sure if this is necessary
	Raphael.el.pointId = function(){
		this.pointId;
	};
	Raphael.el.selected = function(){
		this.selected;
	};
	Raphael.el.point1 = function(){
		this.point1;
	};
	Raphael.el.point2 = function(){   
		this.point2;
	};   
	Raphael.el.pointMove = function(dx, dy){ 
		this.attr({cx: this.ox + dx, cy: this.oy + dy});
		pointUpdateLine(this.pointId, this.ox + dx, this.oy + dy);
		pointUpdateMidpoint(this.pointId, this.ox + dx, this.oy + dy);
	}
	Raphael.el.pointStart = function(){ 
		this.ox = this.attr("cx");
		this.oy = this.attr("cy");
		this.attr({opacity: 1});
	}
	Raphael.el.pointUp = function(){
		this.attr({opacity: pointOpacity});
		pointUpdateLine(this.pointId, this.attr("cx"), this.attr("cy"));
		pointUpdateMidpoint(this.pointId, this.attr("cx"), this.attr("cy"));
	}   
	Raphael.el.lineMove = function(dx, dy){
		pointArray[this.point1].pointMove(dx, dy);
		pointArray[this.point2].pointMove(dx, dy);
	}
	Raphael.el.lineStart = function(){
		pointArray[this.point1].pointStart();
		pointArray[this.point2].pointStart();
		this.attr({opacity: 1});
	}
	Raphael.el.lineUp = function(){
		pointArray[this.point1].pointUp();
		pointArray[this.point2].pointUp();
		this.attr({opacity: pointOpacity});
	}
	Raphael.el.midpointMove = function(dx, dy){
		pointArray[this.point1].pointMove(dx, dy);
		pointArray[this.point2].pointMove(dx, dy);
	}
	Raphael.el.midpointStart = function(){
		pointArray[this.point1].pointStart();
		pointArray[this.point2].pointStart();
		this.attr({opacity: 1});
	}
	Raphael.el.midpointUp = function(){
		pointArray[this.point1].pointUp();
		pointArray[this.point2].pointUp();
		this.attr({opacity: pointOpacity});
	}
   
   //raphael object variables and instantiation
   var planeSize = 800;
   var pointSize = 10;
   var pointOpacity = .6;
   var plane = Raphael(divId, planeSize, planeSize);

   //points
   var pointArray = [];
   var numPoints = 0;
   var selectedPointArray = [];
   var numSelectedPoints = 0;
   function makePoint(x, y){
      var c = plane.circle(x, y, pointSize);
      c.attr({fill: "black", opacity: pointOpacity});
      c.pointId = numPoints;
      numPoints += 1; //shouldn't be here
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
      c.drag(c.pointMove, c.pointStart, c.pointUp);
      return c;
   }
   function pointExists(xPosition, yPosition){
      for(var i = 0, len = pointArray.length; i < len; i++){
	 if(pointArray[i].attr("cx") === xPosition && pointArray[i].attr("cy") === yPosition){
	    return true;
	 }
      }
      return false;
   }
   function pointsToFront(){
      for(var i = 0, len = pointArray.length; i < len; i++){
	 pointArray[i].toFront();
      }
   }
   function pointUpdateLine(pointId, newx, newy){
      for(var i = 0; i<lineArray.length; i++){
		if(lineArray[i].point1 === pointId){
			for(var j = 0; j<pointArray.length; j++){
				if(pointArray[j].pointId === lineArray[i].point2){
					var newpoint2 = pointArray[j].pointId;
					var oldx = pointArray[j].attr("cx");
					var oldy = pointArray[j].attr("cy");
				}
			}
			var newpoint1 = pointId;
			lineArray[i].hide();
			var newpath = makeLine(newpoint1, newx, newy, newpoint2, oldx, oldy);
			lineArray.splice(i, 1, newpath);
		}
		else if(lineArray[i].point2 === pointId){
			for(var j = 0; j<pointArray.length; j++){
				if(pointArray[j].pointId === lineArray[i].point1){
					var newpoint2 = pointArray[j].pointId;
					var oldx = pointArray[j].attr("cx");
					var oldy = pointArray[j].attr("cy");
				}
			}
			var newpoint1 = pointId;
			lineArray[i].hide();
			var newpath = makeLine(newpoint1, oldx, oldy, newpoint2, newx, newy);
			lineArray.splice(i, 1, newpath);
		}
      }
   }
   function pointUpdateMidpoint(pointId, newx, newy){
      for(var i = 0; i<midpointArray.length; i++){
	 if(midpointArray[i].point1 === pointId){
	    for(var j = 0; j<pointArray.length; j++){
	       if(pointArray[j].pointId === midpointArray[i].point2){
		  var newpoint2 = pointArray[j].pointId;
		  var oldx = pointArray[j].attr("cx");
		  var oldy = pointArray[j].attr("cy");
	       }
	    }
	    var newpoint1 = pointId;
	    midpointArray[i].hide();
		var newMidpoint = makeMidpoint(newpoint1, newx, newy, newpoint2, oldx, oldy);
	    midpointArray.splice(i, 1, newMidpoint);
	 }
	 else if(midpointArray[i].point2 === pointId){
	    for(var j = 0; j<pointArray.length; j++){
	       if(pointArray[j].pointId === midpointArray[i].point1){
		  var newpoint2 = pointArray[j].pointId;
		  var oldx = pointArray[j].attr("cx");
		  var oldy = pointArray[j].attr("cy");
	       }
	    }
	    var newpoint1 = pointId;
	    midpointArray[i].hide();
		var newMidpoint = makeMidpoint(newpoint1, oldx, oldy, newpoint2, newx, newy);
	    midpointArray.splice(i, 1, newMidpoint);
	 }
      }
   }

   //lines
   var lineArray = [];
   var numLines = 0;
   var selectedLineArray = [];
   var numSelectedLines = 0;
   function makeLine(point1, point1x, point1y, point2, point2x, point2y){
      var newline = plane.path("M" + point1x + " " + point1y + "L" + point2x + " " + point2y);
      newline.point1 = point1;
      newline.point2 = point2;
      newline.selected = 0;
      //click stuff
      newline.attr({fill: "black", opacity: pointOpacity, "stroke-width": 5});
      newline.lineId = numLines;
      numLines += 1;
      newline.dblclick(function(e){
		     if(this.selected === 0){
			this.attr({stroke: "red"});
			this.selected = 1;
			numSelectedLines += 1;
		     }
		     else if(this.selected === 1){
			this.attr({stroke: "black"});
			this.selected = 0;
			numSelectedLines -= 1;
		     }
		  });
      newline.drag(newline.lineMove, newline.lineStart, newline.lineUp);
      pointsToFront();
      return newline;
   }
   function lineExists(point1, point2){
      for(var i=0; i<lineArray.length; i++){
	 if(lineArray[i].point1 === point1 && lineArray[i].point2 === point2){
	    return true;
	 }
	 if(lineArray[i].point1 === point2 && lineArray[i].point2 === point1){
	    return true;
	 }
      }
      return false;
   }
   function newLine(){
      var selectedPoints = [];
      for(var i=0; i<pointArray.length; i++){
	 if(pointArray[i].selected === 1){
	    selectedPoints.push(pointArray[i]);
	 }
      }
      for(var i=0; i<selectedPoints.length; i++){
	 var outerId = selectedPoints[i].pointId;
	 for(var j=i; j<selectedPoints.length; j++){
	    var innerId = selectedPoints[j].pointId;
	    if(innerId !== outerId && lineExists(outerId, innerId) === false){
	       var newLine = makeLine(outerId, selectedPoints[i].attr("cx"), selectedPoints[i].attr("cy"), innerId, selectedPoints[j].attr("cx"), selectedPoints[j].attr("cy"));
	       lineArray.push(newLine);
	    }
	 }
      }
   } 

   //midpoints
   var midpointArray = [];
   var numMidpoints = 0;
   var selectedMidpointArray = [];
   var numSelectedMidpoints = 0;
   function makeMidpoint(point1, point1x, point1y, point2, point2x, point2y){
      var midx = (point1x + point2x)/2;
      var midy = (point1y + point2y)/2; 
      var c = plane.circle(midx, midy, pointSize);
      c.attr({fill: "black", opacity: pointOpacity});
      c.point1 = point1;
      c.point2 = point2;
      numMidpoints += 1;
      c.selected = 0;
      c.dblclick(function(e){
	 if(this.selected === 0){
	    this.attr({fill: "red"});
	    this.selected = 1;
	    numSelectedMidpoints += 1;
	 }
	 else if(this.selected === 1){
	    this.attr({fill: "black"});
	    this.selected = 0;
	    numSelectedMidpoints -= 1;
	 }
      });
      c.drag(c.midpointMove, c.midpointStart, c.midpointUp);
      return c;
   }
   function midpointExists(point1, point2){
      for(var i=0; i<midpointArray.length; i++){
	 if(midpointArray[i].point1 === point1 && midpointArray[i].point2 === point2){
	    return true;
	 }
	 if(midpointArray[i].point1 === point2 && midpointArray[i].point2 === point1){
	    return true;
	 }
      }
      return false;
   }
   function newMidpoint(){
      var selectedPoints = [];
      for(var i=0; i<pointArray.length; i++){
	 if(pointArray[i].selected === 1){
	    selectedPoints.push(pointArray[i]);
	 }
      }

      for(var i=0; i<selectedPoints.length; i++){
	 var outerId = selectedPoints[i].pointId;
	 for(var j=i; j<selectedPoints.length; j++){
	    var innerId = selectedPoints[j].pointId;
	    if(innerId !== outerId && midpointExists(outerId, innerId) === false){
	       var newMidpoint = makeMidpoint(outerId, selectedPoints[i].attr("cx"), selectedPoints[i].attr("cy"), innerId, selectedPoints[j].attr("cx"), selectedPoints[j].attr("cy"));
	       midpointArray.push(newMidpoint);
	    }
	 }   
      }
   }
   
   //circles
   var circleArray = [];
   var numCircles = 0;
   var selectedCircleArray = [];
   var numSelectedCircles = 0;
   function makeCircle(){
   
   }
   function newCircle(){
	return null;
   }

   //deleting 
   function deleteSelected(){
      deleteSelectedPoints();
      deleteSelectedLines();
		deleteSelectedMidpoints();
   }
   function deleteSelectedLines(){
      var i = 0;
      while(i < lineArray.length){
	 if(lineArray[i].selected === 1){
	    lineArray[i].remove();
	    lineArray.splice(i, 1);
	    numSelectedLines -= 1;
	    numLines -= 1;
	 }
	 else{
	    i++;
	 }
      }
   }
   
   function deleteSelectedMidpoints(){
      var i = 0;
      while(i < midpointArray.length){
	 if(midpointArray[i].selected === 1){
	    midpointArray[i].remove();
	    midpointArray.splice(i, 1);
	    numSelectedLines -= 1;
	    numLines -= 1;
	 }
	 else{
	    i++;
	 }
      }
   }
   
   function deleteSelectedPoints(){
      var i = 0;
      while(i < pointArray.length){
	 if(pointArray[i].selected === 1){
	    //first check if there are lines associated with this point and mark them as selected
	    for(var j = 0; j < lineArray.length; j++){
	       if(lineArray[j].point1 === pointArray[i].pointId || lineArray[j].point2 === pointArray[i].pointId){
		  lineArray[j].selected = 1;
	       }
	    } 
		for(var j = 0; j < midpointArray.length; j++){
	       if(midpointArray[j].point1 === pointArray[i].pointId || midpointArray[j].point2 === pointArray[i].pointId){
		  midpointArray[j].selected = 1;
	       }
	    } 
	    pointArray[i].remove();
	    pointArray.splice(i, 1);
	    numSelectedPoints -= 1;
	    numPoints -= 1;
	 }
	 else{
	    i++;
	 }
      }
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
	       if(e.pageY > iconSize){
		  if(pointExists(e.pageX, e.pageY) === false){
		     var newpoint = makePoint(e.pageX, e.pageY);
		     pointArray[newpoint.pointId] = newpoint;
		  }
	       } 
	    });
	    
	 }
      }

      /* here is where we'll want to draw our icons
      */
      var iconSize = 75;
      var drawLineIconPos = iconSize * 0;
      var deleteIconPos = iconSize * 1;
      var midpointIconPos = iconSize * 2;
	  var circleIconPos = iconSize * 3;
      plane.path("M0 " + iconSize + "L" + planeSize + " " + iconSize);
      //draw line
      plane.rect(drawLineIconPos, 0, iconSize, iconSize);
      plane.path("M" + (drawLineIconPos + 10) + " " + iconSize/2 + "L" + (drawLineIconPos + iconSize - 10) + " " + iconSize/2);
      plane.circle(drawLineIconPos + 10, iconSize/2, 5).attr({fill:"red"});
      plane.circle(drawLineIconPos + iconSize - 10, iconSize/2, 5).attr({fill:"red"});
      plane.rect(drawLineIconPos, 0, iconSize, iconSize).attr({fill:"black", opacity:"0.01"}).click(newLine);
      //delete
      plane.rect(deleteIconPos, 0, iconSize, iconSize);
      plane.text(deleteIconPos + iconSize/2, iconSize/2 - 10, "Delete");
      plane.text(deleteIconPos + iconSize/2, iconSize/2 + 10, "Selected");
      plane.rect(deleteIconPos, 0, iconSize, iconSize).attr({fill:"black", opacity:"0.01"}).click(deleteSelected);
      ///midpoint
      plane.rect(midpointIconPos, 0, iconSize, iconSize);
      plane.circle(midpointIconPos + 10, iconSize/2, 5).attr({fill:"red"});
      plane.circle(midpointIconPos + iconSize - 10, iconSize/2, 5).attr({fill:"red"});
      plane.circle(midpointIconPos + iconSize/2, iconSize/2, 5).attr({fill:"black"});
      plane.rect(midpointIconPos, 0, iconSize, iconSize).attr({fill:"black", opacity:"0.01"}).click(newMidpoint);
	  //circle
	  plane.rect(circleIconPos, 0, iconSize, iconSize);
	  plane.circle(circleIconPos + iconSize/2, iconSize/2, 5).attr({fill:"red"});
	  plane.circle(circleIconPos + iconSize/2 + iconSize/2 - 10, iconSize/2, 5).attr({fill:"red"});
	  plane.circle(circleIconPos + iconSize/2, iconSize/2, iconSize/2 - 10).attr({stroke:"black"});
	  plane.rect(circleIconPos, 0, iconSize, iconSize).attr({fill:"black", opacity:"0.01"}).click(newCircle);
	  
   }
}
