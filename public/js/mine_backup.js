module.exports = {
	main:function() {
		return `
			// 게임판의 행 또는 열의 크기
			var size = 32;

			var	mineB = new Mine_Board(10, 10, 20);
			var	playerB = new Player_Board(10, 10, 20);

			var game_over = false;
			var window_row, window_col = 0;

			var initGrid = function(x, y) {
				window_row = x;
				window_col = y;
			}

			var init = function(x, y) {
				initGrid(x, y);
			}
			init(10, 10);

			var c = document.getElementById("c")

			// 기존 마우스 이벤트 제거
			c.addEventListener('contextmenu', function() {
			  event.preventDefault();
			});

			// 마우스 이벤트 설정
			// c.addEventListener('mouseup', function(){
			// 	var x = Math.floor(event.offsetX / size);
			// 	var y = Math.floor(event.offsetY / size);

			// 	//alert("x|"+x+" y|"+y + "클릭한것"+event.button);

			// 	if(event.button === 0) {
			// 		playerB.open(x, y, mineB);
			// 	} else if(event.button === 2) {
			// 		if (playerB.get_cell(x, y) === 10) {
			// playerB.set_cell(x, y, 11);
			// }
			// else if (playerB.get_cell(x, y) == 11) {
			// playerB.set_cell(x, y, 10);
			// }
			// 	}
			// });

			// 현재는 게임판만 나타나게 하려고 함
			var two = new Two({
				fullscreen: false,
				autostart: false,
				width: window_row * size,
				height: window_col * size
				}).appendTo(c);

			two.bind('update', function(frameCount, timeDelta) {
				// 반복할 함수

				if(game_over == true){
					alert("GAME OVER");
					two.unbind('update');
				}
				// 마우스 이벤트 설정
				c.addEventListener('mouseup', function(){
				var x = Math.floor(event.offsetX / size);
				var y = Math.floor(event.offsetY / size);

				//alert("x|"+x+" y|"+y + "클릭한것"+event.button);

				if(event.button === 0) {
					playerB.open(x, y, mineB);
				} else if(event.button === 2) {
					if (playerB.get_cell(x, y) === 10) {
 						playerB.set_cell(x, y, 11);
 					}
 					else if (playerB.get_cell(x, y) == 11) {
 						playerB.set_cell(x, y, 10);
 					}
				}
			});
				two.clear();

				for(var i=0;i<window_row;i++) {
					for(var j=0;j<window_col;j++) {
						if (playerB.get_cell(i,j) === 9) {
							playerB.open(i, j, mineB);
						}

						var rect = two.makeRectangle(size / 2 + i * size, size / 2 + j * size, size, size);
						if(playerB.get_cell(i,j) === 11) {
							var texture = new Two.Texture('../lib/mine_images/11.jpg');
							rect.fill = texture; 
						
						} else if(playerB.get_cell(i,j) != 10){
							two.makeText(playerB.get_cell(i,j), size / 2 + i * size, size / 2 + j * size);
						}

						// var texture = new Two.Texture('../lib/mine_images/' + playerB.get_cell(i,j) + '.jpg');
						// rect.fill = texture; 
					}
				}
				game_over = playerB.gameover;
				
			}).play();`
	}
}

// pm2 start main.js --watch --ignore-watch="data/* sessions/*"  --no-daemon

// int main()
// {
// 	std::cout << "Mine Sweeper!\n";
// 	// rand 시드 
// 	std::srand(static_cast<unsigned int>(std::time(NULL)));
// 	sf::RenderWindow app(sf::VideoMode(640, 640), "MineSweeper");
// 	LEVEL e = LEVEL::EASY;
	
// 	mineB = new Mine_Board(25, 25, 80);
// 	playerB = new Player_Board(25, 25, 80);

// 	init(25, 25);

// 	sf::Texture t;
// 	t.loadFromFile("tiles.jpg");
// 	sf::Sprite s(t);
// 	while (app.isOpen() && !game_over)
// 	{


// 		마우스 포인터 위치 찾기
// 		sf::Vector2i pos = sf::Mouse::getPosition(app);
// 		int x = pos.x / size;
// 		int y = pos.y / size;


	
// 		sf::Event e;
// 		while (app.pollEvent(e))
// 		{
// 			if (e.type == sf::Event::Closed)
// 				app.close();

// 			if (e.type == sf::Event::MouseButtonPressed)
// 				if (e.key.code == sf::Mouse::Left) playerB->open(x, y, mineB);
// 				else if (e.key.code == sf::Mouse::Right) {
// 					// 깃발 표시
// 					if (playerB->get_cell(x, y) == 10) {
// 						playerB->set_cell(x, y, 11);
// 					}
// 					else if (playerB->get_cell(x, y) == 11) {
// 						playerB->set_cell(x, y, 10);
// 					}
// 				}
// 		}

// 		app.clear(sf::Color::White);
// 		for (int i = 0; i < window_row; i++)
// 			for (int j = 0; j < window_col; j++)
// 			{
// 				if (playerB->get_cell(i,j) == 9) playerB->open(i, j, mineB);
// 				s.setTextureRect(sf::IntRect(playerB->get_cell(i, j) * size, 0, size, size));
// 				s.setPosition(i*size, j*size);
// 				app.draw(s);
// 			}
// 		game_over = playerB->gameover;
// 		app.display();
// 	}