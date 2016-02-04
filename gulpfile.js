/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

var child_process = require('child_process');
var gulp = require('gulp');
var log = require('gulp-util').log;
var mocha = require('gulp-mocha');
var sourcemaps = require('gulp-sourcemaps');
var os = require('os');
var path = require('path');
var runSequence = require("run-sequence");
var ts = require('gulp-typescript');

var sources = [
    'src'
].map(function (tsFolder) { return tsFolder + '/**/*.ts'; });

gulp.task('build', function () {
    var tsProject = ts.createProject('src/tsconfig.json');
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: 'file:///' + __dirname + '/src/' }))
        .pipe(gulp.dest('out'));
});

gulp.task('watch', ['build'], function (cb) {
    log('Watching build sources...');
    return gulp.watch(sources, ['build']);
});

gulp.task('default', function (callback) {
    runSequence("build", "tslint", callback);
});

var lintSources = [
    'src',
].map(function (tsFolder) { return tsFolder + '/**/*.ts'; });
lintSources = lintSources.concat([
    '!src/typings/**'
]);

var tslint = require('gulp-tslint');
gulp.task('tslint', function () {
    return gulp.src(lintSources, { base: '.' })
        .pipe(tslint())
        .pipe(tslint.report('verbose'));
});

function test() {
    return gulp.src('out/tests/**/*.js', { read: false })
        .pipe(mocha());
}

gulp.task('build-test', ['build'], test);
gulp.task('test', test);

gulp.task('watch-build-test', ['build', 'build-test'], function () {
    return gulp.watch(sources, ['build', 'build-test']);
});