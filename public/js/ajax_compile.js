// run, check버튼을 계속 누름을 방지하는 함수
function submitCheck(submit, run, check) {
    var delay = 1000;
    var submitted = false;

    if(submitted == true) { return; }

    document.getElementById(run).value = 'RUNNING...';
    document.getElementById(run).disabled = true;
    document.getElementById(check).value = 'RUNNING...';
    document.getElementById(check).disabled = true;

    if(submit === "run") {
        setTimeout ('submit_run()', delay);
    } else if(submit === "check") {
        setTimeout ('submit_check()', delay);
    }
    submitted = true;
}

// ajax 형태로 post를 행하는 함수
function submit_run() {
	var editor = ace.edit("editor");
	var editor_run = ace.edit("editor_run");
	
    var code = editor.getValue();
	console.log(code);
    $.ajax({
        type : "POST",
        url : "/running",
        data : {"code": code},
        dataType : "json",
        error: function(jqXHR, exception) {
            if (jqXHR.status === 0) {
                alert('Not connect.\n Verify Network.');
            }
            else if (jqXHR.status == 400) {
                alert('Server understood the request, but request content was invalid. [400]');
            }
            else if (jqXHR.status == 401) {
                alert('Unauthorized access. [401]');
            }
            else if (jqXHR.status == 403) {
                alert('Forbidden resource can not be accessed. [403]');
            }
            else if (jqXHR.status == 404) {
                alert('Requested page not found. [404]');
            }
            else if (jqXHR.status == 500) {
                alert('Internal server error. [500]');
            }
            else if (jqXHR.status == 503) {
                alert('Service unavailable. [503]');
            }
            else if (exception === 'parsererror') {
                alert('Requested JSON parse failed. [Failed]');
            }
            else if (exception === 'timeout') {
                alert('Time out error. [Timeout]');
            }
            else if (exception === 'abort') {
                alert('Ajax request aborted. [Aborted]');
            }
            else {
                alert('Uncaught Error.n' + jqXHR.responseText);
            }
        },
        success : function(data){
            if (data) {
                console.log(data);
                editor_run.setValue(data.result);
				document.getElementById('run').value = "RUN";
				document.getElementById('run').disabled = false;
				document.getElementById('check').value = "CHECK";
				document.getElementById('check').disabled = false;
            }
        }
    });
}

function submit_check() {
	var editor = ace.edit("editor");
	var editor_run = ace.edit("editor_run");
	
    var code = editor.getValue();
	console.log(code);
	
	// 현재 페이지
	var para = document.location.href.split("/");
	// para[3] == 단원 이름
	var lesson = para[3];
	// para[4] == 페이지 이름
	var chapter = para[4];
	
	
    $.ajax({
        type : "POST",
        url : "/checking",
        data : {"code": code,
			   "lesson": lesson,
			   "chapter": chapter
			   },
        dataType : "json",
        error: function(jqXHR, exception) {
            if (jqXHR.status === 0) {
                alert('Not connect.\n Verify Network.');
            }
            else if (jqXHR.status == 400) {
                alert('Server understood the request, but request content was invalid. [400]');
            }
            else if (jqXHR.status == 401) {
                alert('Unauthorized access. [401]');
            }
            else if (jqXHR.status == 403) {
                alert('Forbidden resource can not be accessed. [403]');
            }
            else if (jqXHR.status == 404) {
                alert('Requested page not found. [404]');
            }
            else if (jqXHR.status == 500) {
                alert('Internal server error. [500]');
            }
            else if (jqXHR.status == 503) {
                alert('Service unavailable. [503]');
            }
            else if (exception === 'parsererror') {
                alert('Requested JSON parse failed. [Failed]');
            }
            else if (exception === 'timeout') {
                alert('Time out error. [Timeout]');
            }
            else if (exception === 'abort') {
                alert('Ajax request aborted. [Aborted]');
            }
            else {
                alert('Uncaught Error.n' + jqXHR.responseText);
            }
        },
        success : function(data){
            if (data) {
                page_data = data;
                console.log(data);
				var result = data.result;
				editor_run.setValue(result);
				document.getElementById('run').value = "RUN";
				document.getElementById('run').disabled = false;
				document.getElementById('check').value = "CHECK";
				document.getElementById('check').disabled = false;
				
				var answer_value = editor_run.getValue();
				var last_enter = answer_value.lastIndexOf('\n');
				var answer_compiler = answer_value.substring(0, last_enter);
				
				if(answer_compiler === data.answer) {
					alert("정답입니다!");
				} else {
					alert("오답입니다!");
				}
            }
        }
    });
}
