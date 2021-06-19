const gulp = require('gulp');
const sass = require('gulp-sass'); 
sass.compiler = require('node-sass');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const pug = require('gulp-pug');
const gls = require('gulp-live-server');
const del = require('del');
const terser = require('gulp-terser');

const { src, dest, series, parallel, start, watch } = gulp;

function server() {
	const server = gls.new('./www');
	return server.start();
}


function clean() {
	return del(['public', 'dist'], { force: true });
}

//-----------------------------------------
// - Styling: SASS -> CSS
//-----------------------------------------
function css() {
	return src('assets/scss/*.scss')
	.pipe(sass())
	.pipe(dest('public/css'))
}

function deployCSS() {
	return src('assets/scss/*.scss')
	.pipe(sass())
	.pipe(gcmq())
	.pipe(cleanCSS({compatibility: 'ie8'}))
	.pipe(dest('dist/css'))
}

//-----------------------------------------
// - JS Scripts
//-----------------------------------------
function js() {
	return src('assets/js/*.js')
					.pipe(dest('public/js'));
}

function deployJs() {
	return src('assets/js/*.js')
					.pipe(terser())
					.pipe(dest('dist/js'))
}

//-----------------------------------------
// - HTML
//-----------------------------------------
function deployHTML() {
	return src('assets/pug/pages/**/*.pug')
					.pipe(pug({
						data: {
							deployment: true,
						},
						pretty: true,
					}))
					.pipe(dest('dist'));
}

//-----------------------------------------
// - Watch
//-----------------------------------------
function watchFiles() {
	watch('assets/scss/*.scss', css);
	watch('assets/js/*.js', js);
}

exports.clean = clean;

exports.server = server;

exports.develop = series(
										clean, 
										parallel(css, js),
										watchFiles
									);

exports.deploy = series(
										clean, 
										parallel(deployCSS, deployJs, deployHTML)
									);