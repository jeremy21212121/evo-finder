const gulp        = require('gulp');
const browserSync = require('browser-sync').create();


gulp.task('browser-sync', function() {
    browserSync.init({
        files: ["./*.html", "./js/*.js", "./css/*.css"],
        server: {
            baseDir: "./"
        }
    });
});
