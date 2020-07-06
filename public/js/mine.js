
// 게임판의 행 또는 열의 크기
var size = 30;
var row = 20;
var col = 20;
var mine = 70;

// 객체 생성
var	mineB = new Mine_Board(row, col, mine);
var	playerB = new Player_Board(row, col, mine);


var game_over = false;
var window_row, window_col = 0;

// 초기 게임 windows 구성
var initGrid = function(x, y) {
	window_row = x;
	window_col = y;
}

// var init = function(x, y) {
// 	initGrid(x, y);
// }

initGrid(row, col);

// 지뢰판이 그려지는 부분의 id값을 불러옴
var c = document.getElementById("c");

// 기존 마우스 이벤트 제거
c.addEventListener('contextmenu', function() {
	event.preventDefault();
});

// 현재는 게임판만 나타나게 하려고 함 -> 게임제작 완료
var two = new Two({
	fullscreen: false,
	autostart: false,
	width: window_row * size,
	height: window_col * size
	}).appendTo(c);

// 각각 텍스쳐 별로 미리 특정 변수에 대입(불러오기)
var mine = new Array(window_row);
for(i=0;i<12;i++) {
	mine[i] = new Two.Texture('../lib/mine_images/' + i + '.jpg');
}

// 모든 셀에 대해 two.makeRectangle 했을 때 fill을 위해서 board 크기와 동일한 배열을 생성
var rect = new Array(window_row);
for (i=0;i<window_row;i++){
	rect[i] = new Array(window_col);
}

// 게임판 생성, 모두 닫혀있는 텍스쳐가 나타남
for(var i=0;i<window_row;i++) {
	for(var j=0;j<window_col;j++) {
		if (playerB.get_cell(i, j) === 9) {
			playerB.open(i, j, mineB);
		}
		rect[i][j] = two.makeRectangle(size / 2 + i * size, size / 2 + j * size, size, size);
		rect[i][j].fill = mine[10];
	}
}

// 마우스 이벤트 설정
c.addEventListener('mouseup', function(){
	if(game_over != true){
		// 게임이 끝나도 셀이 열리는 것을 방지
		var x = Math.floor(event.offsetX / size);
		var y = Math.floor(event.offsetY / size);

		// alert("x|"+x+" y|"+y + "클릭한것"+event.button);

		// 좌클릭시 나타나는 이벤트
		if(event.button === 0) {
			for(var i=0;i<window_row;i++) {
				for(var j=0;j<window_col;j++) {
					playerB.open(x, y, mineB);			
					rect[i][j].fill = eval("mine["+playerB.get_cell(i, j)+"];");
				}
			}
		}
		// 우클릭시 나타나는 이벤트
		else if(event.button === 2) {
			if (playerB.get_cell(x, y) === 10) {
				playerB.set_cell(x, y, 11);
				rect[x][y].fill = mine[11];
			}
			else if (playerB.get_cell(x, y) === 11) {
				playerB.set_cell(x, y, 10);
				rect[x][y].fill = mine[10];
			}
		}
	}
});

// 게임이 끝나는지 계속 판단
two.bind('update', function() {
	// 반복할 함수				
	if(game_over === true){
		two.unbind('update');
		alert("GAME OVER");
	}
	game_over = playerB.gameover;
}).play();
