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
    var openlist = [],
        startnode = grid.getNodeAt(startX, startY),
        endnode   = grid.getNodeAt(endX, endY),
        neighbours, neighbour, i, node; 

    openList.push(startnode);
    startnode.opened = true;

    while(openList.length){
        node = openList.shift();
        node.closed = true;

        if(node == endnode) return Util.backtrace(endnode);

        neighbours = grid.getNeighbors(node, this.diagonalMovement);

        for(i=0; i<neighbours.length; i++){
            neighbour = neighbours[i];

            if(!neighbour.opened){
                opeList.push(neighbourNode);
                neighbourNode.parent = node;
                nighbourNode.opened =true;
            }
        }
    }

    return []; 

};

module.exports = BreadthFirstFinder;