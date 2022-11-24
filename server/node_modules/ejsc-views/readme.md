
# EJS Compiled Views

`ejsc-views` Compiles all `<views_dir>/*.ejs` files into a single `<views_dir>/views.js` file.

To install `ejcs-views` module use: `npm i ejsc-views`

```
var ejsc = require('ejsc-views')
ejsc.compile() // compiles all views/*.ejs files into a single /public/js/views.js file
``` 

The views directory and the output directory can be configured in `compile()`

```
compile(views_dir = "views", output_dir = "public/js", details = false)
```

To use globally you can install ejsc-views using the command: `npm i -g  ejsc-views`
The CLI options are:

```
Usage: ejsc [options]

Compile all views/*.ejs files into a single /public/js/views.js file

Options:
  -V, --version              output the version number
  -v, --views <views_dir>    views directory (default: "views")
  -o, --output <output_dir>  output directory (default: "public/js")
  -d, --details              display the compiled views
  -h, --help                 display help for command

```
