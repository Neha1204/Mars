
/**
 * The visualization controller will works as a state machine.
 * See files under the `doc` folder for transition descriptions.
 * See https://github.com/jakesgordon/javascript-state-machine
 * for the document of the StateMachine module.
 */
var Controller = StateMachine.create({
    initial: 'none',
    events: [
        {
            name: 'init',
            from: 'none',
            to:   'ready'
        },
        {
            name: 'set',
            from: '*',
            to:   'ready'
        },
        {
            name: 'search',
            from: 'starting',
            to:   'searching'
        },
        {
            name: 'pause',
            from: 'searching',
            to:   'paused'
        },
        {
            name: 'finish',
            from: 'searching',
            to:   'finished'
        },
        {
            name: 'resume',
            from: 'paused',
            to:   'searching'
        },
        {
            name: 'cancel',
            from: 'paused',
            to:   'ready'
        },
        {
            name: 'modify',
            from: 'finished',
            to:   'modified'
        },
        {
            name: 'reset',
            from: '*',
            to:   'ready'
        },
        {
            name: 'clear',
            from: ['finished', 'modified'],
            to:   'ready'
        },
        {
            name: 'start',
            from: ['ready', 'modified', 'restarting'],
            to:   'starting'
        },
        {
            name: 'restart',
            from: ['searching', 'finished'],
            to:   'restarting'
        },
        {
            name: 'dragStart',
            from: ['ready', 'finished'],
            to:   'draggingStart'
        },
        {
            name: 'dragEnd',
            from: ['ready', 'finished'],
            to:   'draggingEnd'
        },
        {
            name: 'dragEnd2',
            from: ['ready', 'finished'],
            to:   'draggingEnd2'
        },
        {
            name: 'dragEnd3',
            from: ['ready', 'finished'],
            to:   'draggingEnd3'
        },
        {
            name: 'drawWall',
            from: ['ready', 'finished'],
            to:   'drawingWall'
        },
        {
            name: 'eraseWall',
            from: ['ready', 'finished'],
            to:   'erasingWall'
        },
        {
            name: 'rest',
            from: ['draggingStart', 'draggingEnd', 'draggingEnd2', 'draggingEnd3', 'drawingWall', 'erasingWall'],
            to  : 'ready'
        },
    ],
});

$.extend(Controller, {

    gridSize: [64, 36], // number of nodes horizontally and vertically
    operationsPerSecond: 300,
    
     getDest: function(){ 
      var destattr =$('input[name=dest]:checked').val();

      return destattr;
    },

    /**
     * Asynchronous transition from `none` state to `ready` state.
     */
    onleavenone: function() {
        var numCols = this.gridSize[0],
            numRows = this.gridSize[1];

        this.grid = new PF.Grid(numCols, numRows);

        View.init({
            numCols: numCols,
            numRows: numRows
        });
        View.generateGrid(function() {
            Controller.setDefaultStartEndPos();
            Controller.bindEvents();
            Controller.transition(); // transit to the next state (ready)
        });

        this.$buttons = $('.control_button');

        this.hookPathFinding();

        return StateMachine.ASYNC;
        // => ready
    },
    ondrawWall: function(event, from, to, gridX, gridY) {
        this.setWalkableAt(gridX, gridY, false);
        // => drawingWall
    },
    oneraseWall: function(event, from, to, gridX, gridY) {
        this.setWalkableAt(gridX, gridY, true);
        // => erasingWall
    },
    onsearch: function(event, from, to) {
        var grid,
            timeStart, timeEnd,
            finder = Panel.getFinder();

        timeStart = window.performance ? performance.now() : Date.now();
        grid = this.grid.clone();

        var pathA = finder.findPath(
            this.startX, this.startY, this.endX, this.endY, grid
        );
        
     if(this.endX2 !== undefined && Controller.getDest() === "Two"){
        grid1 = this.grid.clone();
        grid2 = this.grid.clone();
        var Path;
        var pathB = finder.findPath(
            this.startX, this.startY, this.endX2, this.endY2, grid1
        );

        var pathC = finder.findPath(
            this.endX, this.endY, this.endX2, this.endY2, grid2
        );

        var lenA = PF.Util.pathLength(pathA), lenB = PF.Util.pathLength(pathB);
        
       if(lenA ===0 || lenB === 0) Path = [];
       else{
        if(lenA < lenB){
            pathC.shift();
            Path = pathA.concat(pathC);  
        }
        
        else{ 
            pathC.pop();
            Path = pathB.concat(pathC.reverse());
        }

       if(lenA+lenB < PF.Util.pathLength(Path)){ 
            pathA.shift();
            Path = (pathB.reverse()).concat(pathA);
       }
      } 
        this.path = Path; 
     }
     else if(this.endX3 !== undefined && Controller.getDest() === "Three"){
var gridB = this.grid.clone(), 
    gridC = this.grid.clone(),
    gridAB = this.grid.clone(),
    gridAC = this.grid.clone(),
    gridBC = this.grid.clone(); 

var pathB = finder.findPath(this.startX, this.startY, this.endX2, this.endY2, gridB); 
var pathC = finder.findPath(this.startX, this.startY, this.endX3, this.endY3, gridC); 
var pathAB = finder.findPath(this.endX, this.endY, this.endX2, this.endY2, gridAB); 
var pathAC = finder.findPath(this.endX, this.endY, this.endX3, this.endY3, gridAC); 
var pathBC = finder.findPath(this.endX2, this.endY2, this.endX3, this.endY3, gridBC); 
 
var lenA = PF.Util.pathLength(pathA),
    lenB = PF.Util.pathLength(pathB),
    lenC = PF.Util.pathLength(pathC),
    lenBC = PF.Util.pathLength(pathBC),
    lenAB = PF.Util.pathLength(pathAB),
    lenAC = PF.Util.pathLength(pathAC);

var lenABC = lenA+lenAB+lenBC,
    lenACB = lenA+lenAC+lenBC,
    lenBCA = lenB+lenBC+lenAC,
    lenBAC = lenB+lenAB+lenAC,
    lenCAB = lenC+lenAC+lenAB,
    lenCBA = lenC+lenBC+lenAB;
   
var min_len = Math.min(lenABC, lenACB, lenBCA, lenBAC, lenCAB, lenCBA);

if(min_len == lenABC) {
   pathAB.shift();
   pathAB.pop();
   pathA = pathA.concat(pathAB);
   pathA = pathA.concat(pathBC); 
   this.path = pathA;
}

else if (min_len == lenACB) {
   pathAC.shift();
   pathAC.pop();
   pathBC.reverse();
   pathA = pathA.concat(pathAC);
   pathA = pathA.concat(pathBC); 
   this.path = pathA;
}

else if (min_len == lenBCA) {
   pathBC.shift();
   pathBC.pop();
   pathAC.reverse();
   pathB = pathB.concat(pathBC);
   pathB = pathB.concat(pathAC); 
   this.path = pathB;
}

else if (min_len == lenBAC) {
   pathAB.reverse();
   pathAB.shift();
   pathAB.pop();
   pathB = pathB.concat(pathAB);
   pathB = pathB.concat(pathAC); 
   this.path = pathB;
}

else if (min_len == lenCAB) {
   pathAC.shift();
   pathAC.pop();
   pathAC.reverse();
   pathC = pathC.concat(pathAC);
   pathC = pathC.concat(pathAB); 
   this.path = pathC;
}

else{
   pathBC.shift();
   pathBC.pop();
   pathBC.reverse();
   pathAB.reverse();
   pathC = pathC.concat(pathBC);
   pathC = pathC.concat(pathAB); 
   this.path = pathC;
}
     }
     else {
        this.path = pathA;
     }

     //   this.path = finder.findPath(
     //       this.startX, this.startY, this.endX, this.endY, grid
     //   );
        this.operationCount = this.operations.length;
        timeEnd = window.performance ? performance.now() : Date.now();
        this.timeSpent = (timeEnd - timeStart).toFixed(4);

        this.loop();
        
        // => searching
    },
    onrestart: function() {
        // When clearing the colorized nodes, there may be
        // nodes still animating, which is an asynchronous procedure.
        // Therefore, we have to defer the `abort` routine to make sure
        // that all the animations are done by the time we clear the colors.
        // The same reason applies for the `onreset` event handler.
        setTimeout(function() {
            Controller.clearOperations();
            Controller.clearFootprints();
            Controller.start();
        }, View.nodeColorizeEffect.duration * 1.2);
        // => restarting
    },
    onpause: function(event, from, to) {
        // => paused
    },
    onresume: function(event, from, to) {
        this.loop();
        // => searching
    },
    oncancel: function(event, from, to) {
        this.clearOperations();
        this.clearFootprints();
        // => ready
    },
    onfinish: function(event, from, to) {
        View.showStats({
            pathLength: PF.Util.pathLength(this.path),
            timeSpent:  this.timeSpent,
            operationCount: this.operationCount,
        });
        View.drawPath(this.path);

        if(!this.path.length) {window.alert("Path not found"); console.log("Not found"); }
        // => finished
    },
    onclear: function(event, from, to) {
        this.clearOperations();
        this.clearFootprints();
        // => ready
    },
    onmodify: function(event, from, to) {
        // => modified
    },
    onset: function(event, from, to) {
        console.log("Onset");
        setTimeout(function() {
            Controller.clearOperations();
            Controller.clearAll();
            Controller.buildNewGrid();
            Controller.setDefaultStartEndPos();
        }, View.nodeColorizeEffect.duration * 1.2);
        // => ready
    },
    onreset: function(event, from, to) {
        setTimeout(function() {
            Controller.clearOperations();
            Controller.clearAll();
            Controller.buildNewGrid();
        }, View.nodeColorizeEffect.duration * 1.2);
        // => ready
    },

    /**
     * The following functions are called on entering states.
     */

    onready: function() {
        console.log('=> ready');
        this.setButtonStates({
            id: 1,
            text: 'Start Search',
            enabled: true,
            callback: $.proxy(this.start, this),
        }, {
            id: 2,
            text: 'Pause Search',
            enabled: false,
        }, {
            id: 3,
            text: 'Clear Walls',
            enabled: true,
            callback: $.proxy(this.reset, this),
        }, {
            id: 4,
            text: 'Set dest',
            enabled: true,
            callback: $.proxy(this.set, this),
        });
        // => [starting, draggingStart, draggingEnd, drawingStart, drawingEnd]
    },
    onstarting: function(event, from, to) {
        console.log('=> starting');
        // Clears any existing search progress
        this.clearFootprints();
        this.setButtonStates({
            id: 2,
            enabled: true,
        }, {
            id: 4,
            text: 'Set dest',
            enabled: false,
            callback: $.proxy(this.set, this),
        });
        this.search();
        // => searching
    },
    onsearching: function() {
        console.log('=> searching');
        this.setButtonStates({
            id: 1,
            text: 'Restart Search',
            enabled: true,
            callback: $.proxy(this.restart, this),
        }, {
            id: 2,
            text: 'Pause Search',
            enabled: true,
            callback: $.proxy(this.pause, this),
        }, {
            id: 4,
            text: 'Set dest',
            enabled: false,
            callback: $.proxy(this.set, this),
        });
        // => [paused, finished]
    },
    onpaused: function() {
        console.log('=> paused');
        this.setButtonStates({
            id: 1,
            text: 'Resume Search',
            enabled: true,
            callback: $.proxy(this.resume, this),
        }, {
            id: 2,
            text: 'Cancel Search',
            enabled: true,
            callback: $.proxy(this.cancel, this),
        }, {
            id: 4,
            text: 'Set dest',
            enabled: true,
            callback: $.proxy(this.set, this),
        });
        // => [searching, ready]
    },
    onfinished: function() {
        console.log('=> finished');
        this.setButtonStates({
            id: 1,
            text: 'Restart Search',
            enabled: true,
            callback: $.proxy(this.restart, this),
        }, {
            id: 2,
            text: 'Clear Path',
            enabled: true,
            callback: $.proxy(this.clear, this),
        }, {
            id: 4,
            text: 'Set dest',
            enabled: true,
            callback: $.proxy(this.set, this),
        });
    },
    onmodified: function() {
        console.log('=> modified');
        this.setButtonStates({
            id: 1,
            text: 'Start Search',
            enabled: true,
            callback: $.proxy(this.start, this),
        }, {
            id: 2,
            text: 'Clear Path',
            enabled: true,
            callback: $.proxy(this.clear, this),
        }, {
            id: 4,
            text: 'Set dest',
            enabled: true,
            callback: $.proxy(this.set, this),
        });
    },

    /**
     * Define setters and getters of PF.Node, then we can get the operations
     * of the pathfinding.
     */
    hookPathFinding: function() {

        PF.Node.prototype = {
            get opened() {
                return this._opened;
            },
            set opened(v) {
                this._opened = v;
                Controller.operations.push({
                    x: this.x,
                    y: this.y,
                    attr: 'opened',
                    value: v
                });
            },
            get closed() {
                return this._closed;
            },
            set closed(v) {
                this._closed = v;
                Controller.operations.push({
                    x: this.x,
                    y: this.y,
                    attr: 'closed',
                    value: v
                });
            },
            get tested() {
                return this._tested;
            },
            set tested(v) {
                this._tested = v;
                Controller.operations.push({
                    x: this.x,
                    y: this.y,
                    attr: 'tested',
                    value: v
                });
            },
        };

        this.operations = [];
    },
    bindEvents: function() {
        $('#draw_area').mousedown($.proxy(this.mousedown, this));
        $(window)
            .mousemove($.proxy(this.mousemove, this))
            .mouseup($.proxy(this.mouseup, this));
    },
    loop: function() {
        var interval = 1000 / this.operationsPerSecond;
        (function loop() {
            if (!Controller.is('searching')) {
                return;
            }
            Controller.step();
            setTimeout(loop, interval);
        })();
    },
    step: function() {
        var operations = this.operations,
            op, isSupported;

        do {
            if (!operations.length) {
                this.finish(); // transit to `finished` state
                return;
            }
            op = operations.shift();
            isSupported = View.supportedOperations.indexOf(op.attr) !== -1;
        } while (!isSupported);

        View.setAttributeAt(op.x, op.y, op.attr, op.value);
    },
    clearOperations: function() {
        this.operations = [];
    },
    clearFootprints: function() {
        View.clearFootprints();
        View.clearPath();
    },
    clearAll: function() {
        this.clearFootprints();
        View.clearBlockedNodes();
    },
    buildNewGrid: function() {
        this.grid = new PF.Grid(this.gridSize[0], this.gridSize[1]);
    },
    mousedown: function (event) {
        var coord = View.toGridCoordinate(event.pageX, event.pageY),
            gridX = coord[0],
            gridY = coord[1],
            grid  = this.grid;

        if (this.can('dragStart') && this.isStartPos(gridX, gridY)) {
            this.dragStart();
            return;
        }
        if (this.can('dragEnd') && this.isEndPos(gridX, gridY)) {
            this.dragEnd();
            return;
        }
        if (this.can('dragEnd2') && this.isEndPos2(gridX, gridY)) {
            this.dragEnd2();
            return;
        }
        if (this.can('dragEnd3') && this.isEndPos3(gridX, gridY)) {
            this.dragEnd3();
            return;
        }
        if (this.can('drawWall') && grid.isWalkableAt(gridX, gridY)) {
            this.drawWall(gridX, gridY);
            return;
        }
        if (this.can('eraseWall') && !grid.isWalkableAt(gridX, gridY)) {
            this.eraseWall(gridX, gridY);
        }
    },
    mousemove: function(event) {
        var coord = View.toGridCoordinate(event.pageX, event.pageY),
            grid = this.grid,
            gridX = coord[0],
            gridY = coord[1];

        if (this.isStartOrEndPos(gridX, gridY)) {
            return;
        }

        switch (this.current) {
        case 'draggingStart':
            if (grid.isWalkableAt(gridX, gridY)) {
                this.setStartPos(gridX, gridY);
            }
            break;
        case 'draggingEnd':
            if (grid.isWalkableAt(gridX, gridY)) {
                this.setEndPos(gridX, gridY);
            }
            break;
        case 'draggingEnd2':
            if (grid.isWalkableAt(gridX, gridY)) {
                this.setEndPos2(gridX, gridY);
            }
            break;
        case 'draggingEnd3':
            if (grid.isWalkableAt(gridX, gridY)) {
                this.setEndPos3(gridX, gridY);
            }
            break;
        case 'drawingWall':
            this.setWalkableAt(gridX, gridY, false);
            break;
        case 'erasingWall':
            this.setWalkableAt(gridX, gridY, true);
            break;
        }
    },
    mouseup: function(event) {
        if (Controller.can('rest')) {
            Controller.rest();
        }
    },
    setButtonStates: function() {
        $.each(arguments, function(i, opt) {
            var $button = Controller.$buttons.eq(opt.id - 1);
            if (opt.text) {
                $button.text(opt.text);
            }
            if (opt.callback) {
                $button
                    .unbind('click')
                    .click(opt.callback);
            }
            if (opt.enabled === undefined) {
                return;
            } else if (opt.enabled) {
                $button.removeAttr('disabled');
            } else {
                $button.attr({ disabled: 'disabled' });
            }
        });
    },
    /**
     * When initializing, this method will be called to set the positions
     * of start node and end node.
     * It will detect user's display size, and compute the best positions.
     */
    setDefaultStartEndPos: function() {
        var width, height,
            marginRight, availWidth,
            centerX, centerY,
            endX, endY,
            nodeSize = View.nodeSize;

        width  = $(window).width();
        height = $(window).height();

        marginRight = $('#algorithm_panel').width();
        availWidth = width - marginRight;

        centerX = Math.ceil(availWidth / 2 / nodeSize);
        centerY = Math.floor(height / 2 / nodeSize);

        this.setStartPos(centerX - 5, centerY);
        this.setEndPos(centerX + 5, centerY);
        
        if(Controller.getDest() === "Two") {
            this.setEndPos2(centerX, centerY);
            
            if(this.endX3){
               this.setEndPos3(64*30, 36*30);
            }
        }
        else if(Controller.getDest() === "Three"){
            this.setEndPos2(centerX, centerY);
            this.setEndPos3(centerX, centerY-5); 
        }
        else{
            if(this.endX2){
         //  Controller.setWalkableAt(this.endX2,this.endY2,true);
         //  View.setNormalPos(this.endX2,this.endY2);
               this.setEndPos2(64*30, 36*30);
               this.endX2 = this.endY2 = undefined;
            }
        
           if(this.endX3){
               this.setEndPos3(64*30, 36*30);
               this.endX3 = this.endY3 = undefined;
            }
       }
    },
    setStartPos: function(gridX, gridY) {
        this.startX = gridX;
        this.startY = gridY;
        View.setStartPos(gridX, gridY);
    },
    setEndPos: function(gridX, gridY) {
        this.endX = gridX;
        this.endY = gridY;
        View.setEndPos(gridX, gridY);
    },
    setEndPos2: function(gridX, gridY) {
        this.endX2 = gridX;
        this.endY2 = gridY;
        View.setEndPos2(gridX, gridY);
    },
    setEndPos3: function(gridX, gridY) {
        this.endX3 = gridX;
        this.endY3 = gridY;
        View.setEndPos3(gridX, gridY);
    },
    setWalkableAt: function(gridX, gridY, walkable) {
        this.grid.setWalkableAt(gridX, gridY, walkable);
        View.setAttributeAt(gridX, gridY, 'walkable', walkable);
    },
    isStartPos: function(gridX, gridY) {
        return gridX === this.startX && gridY === this.startY;
    },
    isEndPos: function(gridX, gridY) {
        return (gridX === this.endX && gridY === this.endY);
    },
    isEndPos2: function(gridX, gridY) {
        if(this.endX2 === undefined) return false;
        return (gridX === this.endX2 && gridY === this.endY2);
    },
    isEndPos3: function(gridX, gridY) {
        if(this.endX3 === undefined) return false;
        return (gridX === this.endX3 && gridY === this.endY3);
    },
    isStartOrEndPos: function(gridX, gridY) {
        return this.isStartPos(gridX, gridY) || this.isEndPos(gridX, gridY) || this.isEndPos2(gridX, gridY) || this.isEndPos3(gridX, gridY);
    },
});
