var ejs = require('ejs');
var fs = require('fs');
var path = require('path');

function compile(filename, context) {
	function innerCompile(innerFilename, innerContext) {
		innerFilename = path.join(path.dirname(filename || '.'), innerFilename);
		var compiled = compile(innerFilename, innerContext == null ? context : innerContext);
		
		// Remove UTF8 BOM from included files
		if(compiled.charAt(0) == '\uFEFF')
			compiled = compiled.substring(1);
		
		return compiled;
	}

	if (typeof context != 'object')
		context = {};
	
	context.global = context;
	context.filename = filename;
	context.compile = innerCompile;
	
	var filedata = fs.readFileSync(filename, { encoding: 'utf-8', flag: 'r' });
	return ejs.render(filedata, context, { compileDebug: false });
}

exports.compile = compile;
