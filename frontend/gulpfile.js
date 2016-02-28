"use strict";

const path = require('path'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    express = require('express'),
    favicon = require('serve-favicon'),
    rimraf = require('rimraf'),
    webpack = require('webpack'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    devConfig = require('./webpack.dev.config.js'),
    prodConfig = require('./webpack.prod.config.js'),
    app = express(),
    port = (process.env.NODE_ENV !== 'production') ? 8000 : process.env.PORT,
    configFavicon = app => app.use(favicon(path.join(__dirname, 'src/images/favicon.ico'))),
    startApp = app =>
        app.listen(port, '0.0.0.0', err => {
            if (err) throw new gutil.PluginError('dev-server', err);
            gutil.log('[dev-server]', '==> Listening on port ' + port + '. Open up http://0.0.0.0:' + port + '/ in your browser.')
        });

gulp.task('default', ['dev-server']);

gulp.task('clean', cb =>
    rimraf('dist/*', err => {
        if (err) throw new gutil.PluginError('clean', err);
        cb()
    })
);

gulp.task('build-dev', ['clean', 'webpack:build-dev'], () => {
    gulp.watch(['src/**/*'], ['webpack:build-dev']);
});

// Production build
gulp.task('build', ['clean', 'webpack:build-prod']);

gulp.task('webpack:build-dev', cb =>
    webpack(Object.create(devConfig)).run((err, stats) => {
        if (err) throw new gutil.PluginError('webpack:build-dev', err);
        gutil.log('[webpack:build-dev]', stats.toString({
            colors: true
        }));

        cb()
    })
);

gulp.task('webpack:build-prod', cb =>
    webpack(Object.create(prodConfig), (err, stats) => {
        if (err) throw new gutil.PluginError('webpack:build-prod', err);
        gutil.log('[webpack:build-prod]', stats.toString({
            colors: true
        }));

        cb()
    })
);

gulp.task('dev-server', ['build-dev'], () => {
    const compiler = webpack(devConfig);
    const devMiddleware = webpackDevMiddleware(compiler, {
        publicPath: devConfig.output.publicPath,
        contentBase: 'src',
        stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false
        }
    });

    app.use(devMiddleware);
    app.use(webpackHotMiddleware(compiler));
    configFavicon(app);
    app.get('*', (req, res) => {
        res.write(devMiddleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
        res.end();
    });

    startApp(app)
});