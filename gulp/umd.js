const del = require('del'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    webpack = require('webpack'),
    webpackUMDConfig = require('../webpack.umd.config'),
    name = ':umd:fantasy-ui-react'

// ----------------------------------------
// Clean
// ----------------------------------------
gulp.task('clean' + name, (cb) => {
    del.sync('./dist/umd/**/*')
    cb()
})

// ----------------------------------------
// Build
// ----------------------------------------
let myDevConfig = Object.create(webpackUMDConfig)
myDevConfig.devtool = 'source-map'
let devCompiler = webpack(myDevConfig)
gulp.task('webpack:build-dev' + name, (callback) => {

    devCompiler.run(function (err, stats) {
        if (err) throw new gutil.PluginError('webpack:build-dev' + name, err)
        gutil.log('[webpack:build-dev]', stats.toString({
            colors: true
        }))
        callback()
    })
})
gulp.task('webpack:build' + name, (callback) => {
    let myConfig = Object.create(webpackUMDConfig)
    myConfig.output.filename = '[name].min.js'
    myConfig.plugins = myConfig.plugins.concat(
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                unused: true,
                dead_code: true,
                warnings: false,
            },
        })
    )
    webpack(myConfig, function (err, stats) {
        if (err) throw new gutil.PluginError('webpack:build' + name, err)
        gutil.log('[webpack:build]', stats.toString({
            colors: true
        }))
        callback()
    })
})
gulp.task('build-dev' + name, ['webpack:build-dev' + name], function () {
    gulp.watch(['src/**/*'], ['webpack:build-dev' + name])
})
gulp.task('build' + name, ['webpack:build' + name])

