function CreateGrid(gr, player) {
	this.player = player || 0;

	if (gr) {
		//console.log(gr);
		this.grid = [];
		for (var i in gr) {
			this.grid.push(gr[i].slice());
		}
		//console.log(this.grid); //needs to be nested slice only dups top level
	} else {
		this.grid = []
		for (var i = 0; i < gridWidth; i++) {
			this.grid.push([]);
			for (var j = 0; j < gridHeight; j++) {
				this.grid[i].push(-1);
			}
		}
	}
	this.column = function(i) {
		return this.grid[i].slice();
	}

	this.getColumnPos = function(i, st, len) {
		var pos = [];
		for (var j = 0; j < len; j++) {
			pos.push(createVector(i, st + j));
		}
		return pos;
	}

	this.row = function(i) {
		var tempRow = []
		for (var j = 0; j < gridWidth; j++) {
			tempRow.push(this.grid[j][i]);
		}
		return tempRow;
	}

	this.getRowPos = function(i, st, len) {
		var pos = [];
		for (var j = 0; j < len; j++) {
			pos.push(createVector(st + j, i));
		}
		return pos;
	}

	this.diagDR = function(i) {
		if (i === undefined) return false;
		if (i > noDiags - 1) return false;
		var startY = min(3 + i, gridHeight - 1);
		var startX = max(0, i - gridHeight + 4);
		var tempRow = []
			// for (var j=0;j<noDiags;j++)
		for (j = 0; j < diagnums[i] + 3; j++) {
			tempRow.push(this.grid[startX + j][startY - j]);
		}
		return tempRow;
	}

	this.getDiagDRPos = function(i, st, len) {
		if (i === undefined) return false;
		if (i > noDiags - 1) return false;
		var startY = min(3 + i, gridHeight - 1);
		var startX = max(0, i - gridHeight + 4);
		var pos = [];
		for (var j = 0; j < len; j++) {
			pos.push(createVector(startX + st + j, startY - st - j));
		}
		return pos;
	}

	this.diagDL = function(i) {
		if (i === undefined) return false;
		if (i > gridWidth + gridHeight - 8) return false;
		var startY = min(3 + i, gridHeight - 1);
		var startX = min(gridWidth - 1, noDiags - i + 2);
		var tempRow = []
		for (j = 0; j < diagnums[i] + 3; j++) {
			// console.log(startX+', '+startY+', '+j);
			tempRow.push(this.grid[startX - j][startY - j]);
		}
		return tempRow;
	}

	this.getDiagDLPos = function(i, st, len) {
		if (i === undefined) return false;
		if (i > gridWidth + gridHeight - 8) return false;
		var startY = min(3 + i, gridHeight - 1);
		var startX = min(gridWidth - 1, noDiags - i + 2);
		var pos = [];
		for (var j = 0; j < len; j++) {
			pos.push(createVector(startX - st - j, startY - st - j));
		}
		return pos;
	}

	this.cell = function(i, j) {
		return this.grid[i][j];
	}

	this.columnNextSpace = function(i) {
		if (i === undefined) {
			return false
		}
		if (this.grid[i] === undefined) console.log({
			i: i,
			grid: this.grid
		});
		for (var j = 0; j < gridHeight; j++) {
			if (this.grid[i][j] === -1) {
				return j
			}
		}
		return -1
	}

	this.addToColumn = function(i, col) {
		var col = col || this.player;
		var j = this.columnNextSpace(i);
		// console.log(j);
		if (!(j === false)) {
			if (j > -1) {
				this.grid[i][j] = col;
				this.player = 1 - this.player;
				// console.log('Added colour '+col+' at: '+i+', '+j);
				//Check diagDL is working for all diagonals
				// var temp = [];
				// for (var k=0;k<noDiags;k++){
				//   temp.push(this.diagDL(k));
				// }
				// console.log(temp);
				return {
					x: i,
					y: j
				};
			} else {
				return false;
			}
		}
	}

	this.toText = function() {
		return "[[" + this.grid.join("],[") + "]]";
	}
}
