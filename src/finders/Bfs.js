
var Util = require('../core/Util');
var DiagonalMovement = require('../core/DiagonalMovement');

/**
 * Breadth-First-Search path finder.
 * @constructor
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 */
function BreadthFirstFinder(opt) {
    opt = opt || {};
    this.allowDiagonal = opt.allowDiagonal;
    this.dontCrossCorners = opt.dontCrossCorners;
    this.diagonalMovement = opt.diagonalMovement;
    this.biDirectional = opt.biDirectional;

    if (!this.diagonalMovement) {
        if (!this.allowDiagonal) {
            this.diagonalMovement = DiagonalMovement.Never;
        } else {
            if (this.dontCrossCorners) {
                this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
            } else {
                this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
            }
        }
    }
}

/**
 * Find and return the the path.
 * @return {Array<Array<number>>} The path, including both start and
 *     end positions.
 */




BreadthFirstFinder.prototype.findPath = function(startX, startY, endX, endY, grid) {
   var bi = this.biDirectional;
   
    var endList = [],
	    listopen = [],
        startnode = grid.getNodeAt(startX, startY),
        endnode   = grid.getNodeAt(endX, endY),
        neighbours, neighbour, i, node,
        by_start = 1, by_end =2; 

    startnode.opened = true;
    startnode.by = by_start;
	listopen.push(startnode);

    if(bi){
       endList.push(endnode);
       endnode.opened = true;
       endnode.by = by_end;
    }

    while(listopen.length){
        node = listopen.shift();
        node.closed = true;

        if(node == endnode) return Util.backtrace(endnode);

        neighbours = grid.getNeighbors(node, this.diagonalMovement);

        for(i=0; i<neighbours.length; i++){
            neighbour = neighbours[i];

            if(!neighbour.opened){
                listopen.push(neighbour);
                neighbour.parent = node;
                neighbour.opened =true;
                neighbour.by = by_start;
            }
            else if(bi && neighbour.by == by_start){
                 return Util.biBacktrace(node, neighbour);
            }
        }

      if(bi){
        node = endList.shift();
        node.closed = true;

        neighbours = grid.getNeighbors(node, this.diagonalMovement);

        for(i=0; i<neighbours.length; i++){
            neighbour = neighbours[i];

            if(!neighbour.opened){
                endList.push(neighbour);
                neighbour.parent = node;
                neighbour.opened = true;
                neighbour.by = by_end;
            }

            else if(neighbour.by == by_start){
                return Util.biBacktrace(neighbour, node);
            }
        }    
      }
    }
    return []; 

};

module.exports = BreadthFirstFinder;