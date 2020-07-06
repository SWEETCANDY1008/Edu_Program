// var Board = require('./Board.js');

class Player_Board extends Board {
    constructor(rows, cols, mine){
        super(rows, cols);
        this.gameover = false;
        this._numMines = mine;
        this._numOpened = 0;
        this._init_Array(10);
    }
    _init_Array(k){
        for (var i = 0; i < this.get_row(); i++) {
            for (var j = 0; j < this.get_col(); j++) {
                this.set_cell(i, j, k);
            }
        }
    }
    open(x, y, b){
        if ((x < 0) || (y < 0) || (x >= this.get_row()) || (y >= this.get_col())) {

        }
        else if (!(this._is_checked(x, y))) { // 오픈되지 않은 곳 이라면
            var copyed = b.get_cell(x, y);
            // 지뢰라면
            if (copyed === 9) {
                this.set_cell(x, y, b.get_cell(x, y));
                this.GameOver();
            }
            // 주변 8칸에 대해 재귀호출
            else if (copyed === 0) {
                for (var i = (x - 1); i < (x + 2); i++) {
                    for (var j = (y - 1); j < (y + 2); j++) {
                        if ((i === x && j === y) || (i < 0) || (j < 0) || (i >= this.get_row()) || (j >= this.get_col())) { // 자신 셀이거나 배열 밖이면 패스
                            continue;
                        }
                        // 재귀 호출
                        this.set_cell(x, y, b.get_cell(x, y));
                        this._numOpened++;
                        this.open(i, j, b);
                    }
                }
            }
            else {
                this.set_cell(x, y, b.get_cell(x, y));
                this._numOpened++;
            }
            // 승리 조건 : 남은 칸 수 = 지뢰 수
            if ((this.get_row()*this.get_col() - this._numOpened) === this._numMines) {
                this.GameClear();
            }
        }
    }
	
    _is_checked(x, y){
        // 기본적으로 10 . 확인한 경우 다른값으로 변경
	    let checked = false;
	    if (this.get_cell(x, y) != 10) {
	    	checked = true;
	    }
	    return checked;
    }
    GameOver(){
        this.gameover = true;
    }
    GameClear(){
        // 구현 필요
    }
};