#!/usr/bin/env node
/**
* CLI Usage: ejsc --views [views_dir] --output [output_dir]
*/
const compile = require("./ejs-compile").compile;
const { Command } = require('commander');
const program = new Command();
const pkg = require("../package.json");
require ('ansicolor').nice

program
    .version(pkg.version)
    .description('Compile all views/*.ejs files into a single /public/js/views.js file')
    .option('-v, --views <views_dir>', 'views directory', 'views')
    .option('-o, --output <output_dir>', 'output directory', 'public/js')
    .option('-d, --details', 'display the compiled views')
    .action((options) => {
        compile(options.views, options.output, options.details);
    });

program.parse(process.argv); 

console.log((`\n|--- EJS Views succesfully Compiled`).green);  

exports.compile = compile;
