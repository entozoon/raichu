//
// Myke's Magical PostCSS Gulping. Gulp it down good sonny! Yeah, like that.
//
//
console.log("Starting Gulp..");
// Includes (all installed via `npm install` which uses package.json)
var gulp                = require('gulp'),
	watch               = require('gulp-watch'),
	postcss             = require('gulp-postcss'),
	sourcemaps          = require('gulp-sourcemaps'),
	cssnext             = require('postcss-cssnext'),
	stripInlineComments = require('postcss-strip-inline-comments'),
	scss                = require('postcss-scss'),
	cssnano             = require('cssnano'),
	colors              = require('colors'),
	lost                = require('lost'),
	//atImport            = require('postcss-import');
	cssimport           = require("gulp-cssimport");

var gulpconfig = require('./gulpconfig.json');

echoFill("\n Loaded in:", 'green', 'white', 'bold');
console.log(process.cwd());
echoFill("\n Running as if from:", 'green', 'white', 'bold');
console.log(gulpconfig.from+"\n");

echoFill("\n Config:", 'green', 'white', 'bold');
console.log(gulpconfig);

// Prepend from value to watch and src etc
for (var i in gulpconfig.watch) {
	gulpconfig.watch[i] = gulpconfig.from + gulpconfig.watch[i];
}
gulpconfig.src  = gulpconfig.from + gulpconfig.src;
gulpconfig.dest = gulpconfig.from + gulpconfig.dest;
echoFill("\n Config Processed:", 'blue', 'white', 'bold');
console.log(gulpconfig);

gulp.task('css', function () {
	console.log(' Started '.bgMagenta.white);
	console.log(gulpconfig.watch);
	// Watch all .css/.scss files within /src for any changes
	watch(gulpconfig.watch, function(evt) {
		echoFill("\n Event..", 'blue', 'white', 'bold');

		// Compile the shizzle from, singularly, src/app.css
		gulp
			.src(gulpconfig.src)
			// @import parse through the src (at least?)
			.pipe(cssimport())
			// Sourcemaps are good for the goose
			.pipe( sourcemaps.init() )
			.pipe( postcss([
				// Import comes with postcss-scss BUT would run after all the other processors
				// Which is retarded because like, lost grids wouldn't work in imported files
				/*
				atImport({
					from: [gulpconfig.from]
				}),
				*/

				// Strip inline comments as they're invalid
				stripInlineComments(),

				// Lost grids, boom. future times.
				lost(),

				// Sass syntax is good for the gander
				require('precss')({}),

				// Minification is good for the ryan gosling
				cssnano(),

				// Magical futuristic variables and such
				// Must be called at the end of processors as it has autoprefixes built-in
				cssnext()
			],{syntax: scss}) )
			.on('error', function(error) { errorOutput(error); })
			// Write source .map file after other tinkerings
			.pipe(sourcemaps.write('.'))
			// Write .css file
			.pipe(gulp.dest(gulpconfig.dest));

			// No idea what happens to the console just before this
			// but it puts an extra newline after somehow
			echoFill(" Compiled", 'green', 'white', 'bold');
	});
	return;
});


// Set default task(s) running
gulp.task('default', ['css']);


function errorOutput(error) {
	//console.log(error);
	// Lots of ways to use these colour functions, not decided which I like most
	console.log('');
	echoFill('', 'red', 'white');
	echoFill(' ERROR FFS SMH FML NGL', 'red', 'yellow', 'bold');
	echoFill('', 'red', 'white');
	echoFill(" Message:", 'red', 'white', 'bold');
	echoFill(" ", 'red', 'white');
	//echoFill(' '+error.message, 'red', 'grey');
	console.log(error.message.red.bold); // message doesn't like background colourage
	echoFill("\n", 'red', 'white');
	echoFill("\n Location:", 'red', 'white', 'bold');
	echoFill("  "+error.fileName, 'red', 'white');
	echoFill(" ", 'red', 'white');
	console.log('');
}

// Nice things are nice.
function fillColumns(string) {
	if (typeof string == 'undefined') string = '';

	var columnCoverage = process.stdout.columns;
	while (columnCoverage < string.length) {
		columnCoverage += process.stdout.columns;
	}

	var padding = '';
	for (var i=string.length; i<columnCoverage; i++) {
		padding += ' ';
	}
	return string + padding;
}


function echoFill(string, bg, fg, bold) {
	if (typeof bold == 'undefined') bold = false;
	else bold = true;

	var string = fillColumns(string);
	// https://github.com/Marak/colors.js
	if (fg == 'red')    string = string.red;
	if (fg == 'white')  string = string.white;
	if (fg == 'yellow') string = string.yellow;
	if (fg == 'grey')   string = string.grey;
	if (bg == 'red')    string = string.bgRed;
	if (bg == 'green')  string = string.bgGreen;
	if (bg == 'blue')  string = string.bgBlue;
	if (bold) string = string.bold;

	process.stdout.write(string);
	process.stdout.write("\n");
}
