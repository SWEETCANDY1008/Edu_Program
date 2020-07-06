function openNav() {
	document.getElementById('navigation').style.width = '250px';
}
function closeNav() {
	document.getElementById('navigation').style.width = '0';
}

function make_editor() {
	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/monokai");
	editor.session.setMode("ace/mode/python");
	editor.setFontSize("18px");
}

function make_editor_run() {
	var editor_run = ace.edit("editor_run");
	editor_run.setTheme("ace/theme/monokai");
	editor_run.session.setMode("ace/mode/python");
	editor_run.renderer.setShowGutter(false);
	editor_run.setReadOnly(true);
	editor_run.setFontSize("18px");
}
