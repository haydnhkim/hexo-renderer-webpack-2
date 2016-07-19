var _ = require('lodash');
var webpack = require('webpack');
var extend = require('util')._extend;
var os = require('os');
var path = require('path');
var MemoryFS = require('memory-fs');
var fs = new MemoryFS();
var TMP_PATH = os.tmpdir();
var isDevMode = process.env.NODE_ENV === 'development';

var renderer = function(data, options, callback) {
  var userConfig = extend(
    hexo.theme.config.webpack || {},
    hexo.config.webpack || {}
  );

  var cwd = process.cwd();

  //
  // Convert config of the entry to object.
  //
  var entry = (function(entry) {
    if (_.isString(entry)) entry = [entry];

    return entry
      .filter(function(n){
        return _.includes(n, 'source')
      })
      .map(function(n){
        return path.join(cwd, n)
      });
  })(userConfig.entry);

  //
  // If this file is not a webpack entry simply return the file.
  //
  if (entry.length === 0) {
    return callback(null, data.text);
  }
  //
  // Copy config then extend it with some defaults.
  //
  var config = extend({}, userConfig);

  if (isDevMode)
    config.devtool = 'cheap-module-eval-source-map';

  config = extend(config, {
    entry: data.path,
    output: {
      entry: data.path,
      path: TMP_PATH,
      filename: path.basename(data.path)
    },
    plugins: [
      new webpack.NoErrorsPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: isDevMode,
        minimize: true,
        compress: { warnings: false }
      }),
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
          isDevMode ? 'development' : 'production')
      })
    ]
  });

  //
  // Setup compiler to use in-memory file system then run it.
  //
  var compiler = webpack(config);
  compiler.outputFileSystem = fs;

  compiler.run(function(err, stats) {
    var output = compiler.options.output;
    var outputPath = path.join(output.path, output.filename);

    if (stats.toJson().errors.length > 0) {
      hexo.log.log(stats.toString());
      return callback(stats.toJson().errors, 'Webpack Error.');
    }

    contents = fs.readFileSync(outputPath).toString();

    // Fix problems with HTML beautification
    // see: https://github.com/hexojs/hexo/issues/1663
    contents = contents
      .replace(/</g, ' < ')
      .replace(/< </g, ' << ');

    return callback(null, contents);
  });

};

hexo.extend.renderer.register('js', 'js', renderer);
