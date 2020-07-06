// https://edykim.com/ko/post/module.exports-and-exports-in-node.js/
// https://stackoverflow.com/questions/39005332/include-es6-class-from-external-file-in-node-js

class Board {
    // 생성자
    constructor(rows, cols) {
        // _var 는 private 변수로 사용한다.
        this._rows = rows;
        this._cols = cols;
        this._make_Array(this._rows, this._cols)
    }
    _make_Array(row, col){
        this._mine_Array = [];
        for (var i = 0; i < row; i++){
            this._mine_Array[i] = [];
            for (var j = 0; j < col; j++){
                this._mine_Array[i][j] = 0;
            }
        }
    }
    get_cell(row, col){
        return this._mine_Array[row][col];
    }
    get_row(){
        return this._rows;
    }
    get_col(){
        return this._cols;
    }
    set_cell(row, col, set){
        this._mine_Array[row][col] = set;
    }
};