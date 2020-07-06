// 각종 import 파일들
const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const app = express();
const parse = require('parse-json');
const bodyParser = require('body-parser');
const lesson_json = require('./lesson.json');


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// express 정적폴더 선언
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));

// ejs 사용을 위한 폴더 선언
app.set('view engine', 'ejs');
app.set('views','./views');

var filelist_section_file = {};
var filelist_section_directory = fs.readdirSync('./views/part/section');

// 각 장별 폴더안에 파일들을 불러 딕셔너리 형식으로 저장
filelist_section_directory.forEach(function(item, index, array) {
	var file  = fs.readdirSync('./views/part/section/'+ item);
	filelist_section_file[item] = file;
});

// part/section 폴더목록을 출력
console.log(filelist_section_directory)

// part/section 폴더목록에 있는 폴더들을 키로 하고, 그 내부의 파일목록을 키값으로 하는 딕셔너리를 출력
console.log(filelist_section_file)



// 서버 최초구동 및 재구동시 모든 contents 파일들이 ejs형식의 파일들로 재작성되어 part/section 폴더에 저장
// contents폴더에서 삭제된 파일이 있는경우, part/section 폴더에서 삭제하는 코드를 작성해야 함.
const create_file = function() {
	// 각 대단원 폴더 목록
	// 1, 2, 3 ...
	const directoryPath = path.join(__dirname, "contents/lesson/");

	// 그 대단원 내부에 있는 chapter들
	// chapter
	const contentFolders = fs.readdirSync(directoryPath);
	
	// markdown변환 툴
	const md = require("markdown-it")({
		html: true,
		xhtmlOut: false,
		breaks: false,
		langPrefix: "language-",
		linkify: true,
		typographer: true,
		quotes: "“”‘’",
		highlight: function(str, lang) {
			if (lang && hljs.getLanguage(lang)) {
				try {
					return ('<pre class="hljs"><code>' + hljs.highlight(lang, str, true).value + "</code></pre>");
				} catch (__) {
				}
			}
		return ('<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>");
		}
	});
	
	// 코드를 예쁘게 꾸며주는 모듈
	const hljs = require("highlight.js");

	// ejs로 렌더링된 파일들을 저장하는 폴더
	const dir = './views/part/section/';
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}

	// 기본으로 틀이 되는 layout파일
	const layoutHtmlFormat = fs.readFileSync(
		"./views/part/template/layout_format.ejs",
		"utf8"
	);

	// 확장자를 제외한 파일 이름을 얻는 함수
	const getHtmlFileName = file => {
		return file.slice(0, file.indexOf(".")).toLowerCase();
	};
	

	
	// map함수로 content안에 있는 파일들을 반복문을 돌면서 deploy안에 html파일 생성
	contentFolders.map(lessons => {
		// lesson => 각각의 대단원들
		// lesson == 1, 2, 3, 4, .....
		const content = fs.readdirSync('./contents/lesson/' + lessons + '/chapter/');
		
		
		
		content.map(chapters => {
			// chapter => 각 대단원 안에있는 chapter
			// chapter == 1, 2, 3, 4...
			
			// 각 chapter에 들어가는 내용들을 담은 파일
			const body = fs.readFileSync('./contents/lesson/' + lessons + '/chapter/' + chapters + '/content.md', "utf8");
			
			// markdown파일을 렌더링
			const convertedBody = md.render(body);
			
			// 해당 대단원의 chapter안에 있는 내용들의 목록
			const filelist = fs.readdirSync('./contents/lesson/' + lessons + '/chapter/' + chapters);

			const choose_template = lesson_json.lesson[lessons].chapter[chapters].template;

			if(choose_template === 1) {
				// code란 파일과 code_answer란 파일이 존재하는경우 오른쪽칸에 컴파일러를 띄운다.
				const code = fs.readFileSync('./contents/lesson/' + lessons + '/chapter/' + chapters + '/code', "utf8");
				const compilers = fs.readFileSync("./views/part/template/compiler.ejs", "utf8");
				var judgment_compiler = ejs.render(compilers, {
					code: code
				});
			} else if(choose_template === 2) {
				// 임시
				const code = fs.readFileSync('./contents/lesson/' + lessons + '/chapter/' + chapters + '/code', "utf8");
				const make_board = fs.readFileSync("./views/part/template/make_board.ejs", "utf8");
				
				var judgment_compiler = ejs.render(make_board, {
					code: code
				});
			} else if(choose_template === 3) {
				// 오른쪽칸에 컴파일러 대신 원하는 내용을 띄울 수 있음
				const make_board = fs.readFileSync("./views/part/template/make_board.ejs", "utf8");
				var judgment_compiler = ejs.render(make_board);
			}
			
			// // 만약 그 목록중 code란 이름의 파일이 없는경우
			// if(filelist.indexOf("code") === -1) {
			// 	// 오른쪽칸에 컴파일러 대신 원하는 내용을 띄울 수 있음
			// 	const make_board = fs.readFileSync("./views/part/template/make_board.ejs", "utf8");
			// 	var judgment_compiler = ejs.render(make_board);

			// } else if(filelist.indexOf("code_answer") === -1 && filelist.indexOf("code") > -1 ) {
			// 	// 임시
			// 	const code = fs.readFileSync('./contents/lesson/' + lessons + '/chapter/' + chapters + '/code', "utf8");
			// 	const make_board = fs.readFileSync("./views/part/template/make_board.ejs", "utf8");
				
			// 	var judgment_compiler = ejs.render(make_board, {
			// 		code: code
			// 	});
				
			// } else if(filelist.indexOf("code_answer") > -1 && filelist.indexOf("code") > -1){
			// 	// code란 파일과 code_answer란 파일이 존재하는경우 오른쪽칸에 컴파일러를 띄운다.
			// 	const code = fs.readFileSync('./contents/lesson/' + lessons + '/chapter/' + chapters + '/code', "utf8");
			// 	const compilers = fs.readFileSync("./views/part/template/compiler.ejs", "utf8");
			// 	var judgment_compiler = ejs.render(compilers, {
			// 		code: code
			// 	});
			// }

			// 이 모든것을 하나로 렌더링한다.
			const articleContent = ejs.render(layoutHtmlFormat, {
				body: convertedBody,
				in_section: judgment_compiler
			});

			// 렌더링된 정보를 저장할 파일 이름을 section폴더에 각 대단원별로, 대단원안에는 chapter파일을 넣도록 폴더를 생성한다.
			const fileName = getHtmlFileName(chapters);
			if (!fs.existsSync(dir + '/' + lessons)) {
				fs.mkdirSync(dir + '/' + lessons);
			}
			
			// 파일을 작성한다.
			fs.writeFileSync(`./views/part/section/${lessons}/${chapters}.ejs`, articleContent);
		});
	});
};


create_file();

// 처음 메인 루트페이지에 접속시 대단원 - chapter 목록을 나타냄
app.get('/', function(request, response) {
	// 메인 Page 작성
	response.render('main', {
		list: lesson_json,
		directorys: filelist_section_directory,
		files: filelist_section_file
	});
});

// 우선 강제로 주소에 대단원에 진입했을때 에러창을 뜨게함, 하지만 추후 chapter를 표시하게끔 할수도 있음.
app.get('/:lesson', function(request, response) {
	var filteredId = path.parse(request.params.lesson).base;
	
	response.render('error', {
		list: lesson_json,
		directorys: filelist_section_directory,
		files: filelist_section_file
	});
});


// 각 chapter 페이지에 접속시 chapter를 나타냄
app.get('/:lesson/:chapter', function(request, response) {
	// 각 대단원과 chapter를 알 수 있게 id를 받아옴
	var filteredId_lesson = path.parse(request.params.lesson).base;
	var filteredId_chapter = path.parse(request.params.chapter).base;
	
	// favicon.ico 에러 해결, 필요없는 코드가 될 수도 있음
	if(filteredId_lesson != "favicon.ico") {
		// 해당하는 chapter파일을 불러온다.
		fs.readFile('./views/part/section/' + filteredId_lesson + '/' + filteredId_chapter + '.ejs', 'utf8', function(err, content) {
			// 만약 없는 파일일 경우
			if(err) {
				console.log("ERROR PAGE! NO FILE!");
				// 에러 페이지를 렌더링
				response.render('error', {
					list: lesson_json,
					directorys: filelist_section_directory,
					files: filelist_section_file
				});
			//존재하는 파일일 경우
			} else {
				// chapter 이동버튼 구현을 위한 작업들
				// 그 대단원의 chapter들의 리스트
				var filelists = filelist_section_file[filteredId_lesson];

				// 그리고 그 리스트의 길이
				var fileLength = filelists.length;
				
				console.log("FILE OPEN!");
				// 일반적인 페이지를 렌더링
				response.render('page', {
					list: lesson_json,
					directorys: filelist_section_directory,
					files: filelist_section_file,
					filelength: fileLength,	
					content: ejs.render(content)
				});
			}
		});
	}
});

// 컴파일러가 있는 페이지에서 CHECK버튼을 눌렀을때 ajax형태로 post를 받았을때 접근
// RUN과 다른점은 주어진 문제에 대한 답과 비교하여 정답여부를 알려주게됨
app.post("/checking", function(request, response) {
	// 실행된 페이지의 lesson과 chapter를 ajax형태로 post방식으로 받음
	var filteredId_lesson = request.body.lesson;
	var filteredId_chapter = request.body.chapter;

	// 받은 정보를 바탕으로 서버에서 python파일을 실행시킨 결과를 받음
	var result = py_compile(filteredId_lesson, filteredId_chapter, request, response);
	
	// 정답파일을 불러와 저장
	var answer = fs.readFileSync('./contents/lesson/' + filteredId_lesson + '/chapter/' + filteredId_chapter + '/answer', 'utf8');
	
	// 이것을 다시 ajax로 보냄
	console.log('POST Parameter result = ' + result);
	console.log('POST Parameter answer = ' + answer);
	response.send({
		result: result,
		answer: answer
	});
});

app.post("/show_answer", function(request, response) {
	// 실행된 페이지의 lesson과 chapter를 ajax형태로 post방식으로 받음
	var filteredId_lesson = request.body.lesson;
	var filteredId_chapter = request.body.chapter;
	
	// 정답 코드 파일을 불러와 저장
	var answer_code = fs.readFileSync('./contents/lesson/' + filteredId_lesson + '/chapter/' + filteredId_chapter + '/code_answer', 'utf8');
	
	// 이것을 다시 ajax로 보냄
	console.log('POST Parameter answer_code = ' + answer_code);
	response.send({
		answer_code: answer_code
	});
});

app.post("/board_size", function(request, response) {
	// 실행된 페이지의 lesson과 chapter를 ajax형태로 post방식으로 받음
	var filteredId_lesson = request.body.lesson;
	var filteredId_chapter = request.body.chapter;
	var code = request.body.code;
	console.log(code);
	
	const level_json = require('./contents/lesson/' + filteredId_lesson + '/chapter/' + filteredId_chapter + '/level.json');
	console.log(level_json);

	var ingame_level = code.substring(code.indexOf("=")+3, code.indexOf(",")-1);
	console.log(ingame_level)

	if(ingame_level === "easy") {
		var code_answer = fs.readFileSync('./contents/lesson/' + filteredId_lesson + '/chapter/' + filteredId_chapter + '/code_answer_easy', 'utf8');
		console.log("code_answer : " + code_answer);
	
		var code = request.body.code;
		console.log("code : " + code);
	
		var code_answer_replace = code_answer.replace(/\r\n/g, "");
		console.log("code_answer_replace : " + code_answer_replace);
	
		var code_replace = request.body.code.replace(/,/gi, "");
		console.log("code_replace : " + code_replace);

		if(code_answer_replace === code_replace) {
			var level = level_json.easy;
			console.log(level_json.easy.row)
			console.log(level_json.easy.col)
			console.log(level_json.easy.mine)
		}

	} else if(ingame_level === "normal") {
		var code_answer = fs.readFileSync('./contents/lesson/' + filteredId_lesson + '/chapter/' + filteredId_chapter + '/code_answer_normal', 'utf8');
		console.log("code_answer : " + code_answer);
	
		var code = request.body.code;
		console.log("code : " + code);
	
		var code_answer_replace = code_answer.replace(/\r\n/g, "");
		console.log("code_answer_replace : " + code_answer_replace);
	
		var code_replace = request.body.code.replace(/,/gi, "");
		console.log("code_replace : " + code_replace);

		if(code_answer_replace === code_replace) {
			var level = level_json.normal;
			console.log(level_json.normal.row)
			console.log(level_json.normal.col)
			console.log(level_json.normal.mine)
		}

	} else if(ingame_level === "hard") {
		var code_answer = fs.readFileSync('./contents/lesson/' + filteredId_lesson + '/chapter/' + filteredId_chapter + '/code_answer_hard', 'utf8');
		console.log("code_answer : " + code_answer);
	
		var code = request.body.code;
		console.log("code : " + code);
	
		var code_answer_replace = code_answer.replace(/\r\n/g, "");
		console.log("code_answer_replace : " + code_answer_replace);
	
		var code_replace = request.body.code.replace(/,/gi, "");
		console.log("code_replace : " + code_replace);

		if(code_answer_replace === code_replace) {
			var level = level_json.hard;
			console.log(level_json.hard.row)
			console.log(level_json.hard.col)
			console.log(level_json.hard.mine)
		}

	} else {
		var level = "none";
		console.log("error")
	}

	// 이것을 다시 ajax로 보냄
	console.log('POST Parameter result = ' + level);
	response.send({
		level: level,
		answer: code_answer
	});
});

app.listen(8000, function() {
    console.log('Example app listening on port 8000!');
});


// python 컴파일을 위한 함수 => docker로 대체되고 있음.
// python 컴파일을 위한 함수 => docker로 대체되고 있음.
const py_compile = function(filteredId_lesson, filteredId_chapter, request, response) {
	// 우리가 원하는 코드와 일치하는지 확인하기 위한 파일
	var code_answer = fs.readFileSync('./contents/lesson/' + filteredId_lesson + '/chapter/' + filteredId_chapter + '/code_answer', 'utf8');
	console.log("code_answer : " + code_answer);

	var code = request.body.code;
	console.log("code : " + code);

	var code_answer_replace = code_answer.replace(/\r\n/g, "");
	console.log("code_answer_replace : " + code_answer_replace);

	var code_replace = request.body.code.replace(/,/gi, "");
	console.log("code_replace : " + code_replace);
	
	
	// 정답 코드와 작성 코드 비교	
	if(code_answer_replace === code_replace) {
		console.log(code);

		// var source = code.split(/\r\n | \r\n/).join("\n");
		// source = source + "\nprint(dataToSendBack)\nsys.stdout.flush()";
		var source = code_answer;

		var d = new Date();
		var time = d.getTime();

		var file_py = path.join(__dirname, "py_file/test" + "_" + time + ".py");
		var create_py = fs.writeFileSync(file_py, source, 'utf8');

		var spawnSync = require('child_process').spawnSync;
		var child = spawnSync('python3', ["-u", file_py]);

		console.log('error : ' + child.error);
		console.log('stdout : ' + child.stdout.toString());
		console.log('stderr : ' + child.stderr.toString());

		// stdout : 화면에 무엇인가 출렷되었을 때, 출력된 정보를 모두 data로 받습니다.
		// stderr : 이것도 일반적으로 화면에 출력된 것인데, 그중에서 에러 정보만을 data로 받는 것입니다.
		var result = "";

		if(child.stdout.toString() != "" && child.stderr.toString() == "") {
			result = child.stdout.toString();
			var file_delete = fs.unlinkSync(file_py);
			return result;
		} else if(child.stdout.toString() == "" && child.stderr.toString() != "") {
			result = child.stderr.toString();
			var file_delete = fs.unlinkSync(file_py);
			return result;
		}
	} else {
		result = code.replace(/,/gi, "\n");
		return result;
	}
}