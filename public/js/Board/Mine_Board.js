// var Board = require('./Board.js');

class Mine_Board extends Board {
	constructor(rows, cols, mine){
		super(rows, cols);
		this._numMines = mine;
		this._set_Mine();
		this._set_Num();
	}
	_set_Mine(){
		let x, y;
		for (var i = 0; i < this.get_numMines(); i++){
			x = this._get_RandNum(0, this.get_row());
			y = this._get_RandNum(0, this.get_col());
			if(this.get_cell(x,y) === 0){
				this.set_cell(x, y, 9);
			}
			else{
				i--;
			}
		}
	}
	
	_set_Num(){
		for(var i = 0; i < this.get_row(); i++){
			for(var j = 0; j < this.get_col(); j++){
				if(this.get_cell(i, j) != 9){
					var n = 0; // 주변 지뢰 개수
					for (var i2 = (i - 1); i2 < (i + 2); i2++) {
						for (var j2 = (j - 1); j2 < (j + 2); j2++) {
							if ((i2 === i && j2 === j) || (i2 < 0) || (j2 < 0) || (i2 >= this.get_row()) || (j2 >= this.get_col())) { // 자신 
								continue;
							}
							else if (this.get_cell(i2, j2) === 9) {
								// 주변에 지뢰가 있다면
								n++;
							}
						}
					}
					// 값 설정
					this.set_cell(i, j, n);
				}
			}
		}
	}
	_get_RandNum(min, max){
		return Math.floor(Math.random() * max) + min;
	}
	get_numMines(){
		return this._numMines;
	}
};