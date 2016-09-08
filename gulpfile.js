//
// Myke's Magical PostCSS Gulping. Gulp it down good sonny! Yeah, like that.
//
//
var gulpconfig = require('./gulpconfig.json');

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
    lost                = require('lost');


gulp.task('css', function () {
	console.log(' Started '.bgMagenta.white);

	// Watch all .css/.scss files within /src for any changes
	watch(gulpconfig.watch, function(evt) {
		// Compile the shizzle from, singularly, src/app.css
		gulp
			.src(gulpconfig.src)
			// Sourcemaps are good for the goose
			.pipe( sourcemaps.init() )
			.pipe( postcss([
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
			.pipe(gulp.dest(gulpconfig.build));

			console.log(' Compiled '.bgGreen.white);
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
	if (bold) string = string.bold;

	process.stdout.write(string);
}
