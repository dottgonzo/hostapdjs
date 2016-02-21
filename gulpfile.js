'use strict';
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var tsProject = ts.createProject('tsconfig.json');
var spawn = require('child_process').spawn;
var bump = require('gulp-bump');

var prompt = require('gulp-prompt');
var git = require('gulp-git');

gulp.task('quickpatch', ['pushPatch'], function (done) {
  spawn('npm', ['publish'], { stdio: 'inherit' }).on('close', done);
});

gulp.task('bumpPatch', function () {
    return gulp.src('./package.json').pipe(bump({
        type: 'patch'
    })).pipe(gulp.dest('./'));
});


gulp.task('Addbumped', ['bumpPatch'], function () {
    return gulp.src('.').pipe(git.add({ args: '-A' }));
});
gulp.task('pushPatch', ['Addbumped'], function () {
    return gulp.src('.').pipe(prompt.prompt({
        type: 'input',
        name: 'commit',
        message: 'enter a commit msg, eg initial commit'
    }, function (res) {
        return gulp.src('.').pipe(git.commit(res.commit)).on('end', function () {
            git.push()
        });;
    }));
});

gulp.task('test', function (done) {
    return gulp.src('test/**/*.js', { read: false })
        .pipe(mocha({ reporter: 'spec' }).on('error', function (err) {
     throw err;
   }).on('close', function () {
        process.exit(-1);
   }));
});

gulp.task('build', function () {
    var tsResult = tsProject.src() // instead of gulp.src(...)
        .pipe(sourcemaps.init()) // This means sourcemaps will be generated 

        .pipe(ts(tsProject, {
            sortOutput: true,
					   }));

    return tsResult
        .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file 
        .pipe(gulp.dest('.'));
});
