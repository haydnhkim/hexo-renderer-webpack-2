# hexo-renderer-webpack-2

Add Hexo support for Webpack(v2).

Fork from the original hexo-renderer-webpack repository: https://github.com/briangonzalez/hexo-renderer-webpack

## Install

``` bash
$ npm install --save hexo-renderer-webpack-2
```

## Options

You can configure this plugin in `_config.yml` or your theme's `_config.yml`.

If you want to use some presets, you will need to install and set presets value.

```
$ npm install --save-dev babel-core babel-loader babel-preset-es2015 babel-preset-react babel-preset-stage-0
```

``` yaml
webpack:
  entry: "source/scripts/faq.js"
  module:
    loaders:
      -
        test: !!js/regexp /\.json$/
        loader: "json-loader"
      -
        test: !!js/regexp /\.(png|jpg|jpeg|gif|svg|woff|woff2)(\?.*)?$/
        loader: "file-loader"
      -
        test: !!js/regexp /\.js$/
        exclude: !!js/regexp /node_modules/
        loader: "babel"
        query:
          presets:
            - "es2015"
            - "stage-0"
            - "react"
```

or

``` yaml
webpack:
  entry:
    - 'themes/my-theme/source/js/app.js'
    - 'themes/my-theme/source/js/lib.js'
```

## Development Mode

This project uses NODE_ENV variable for sourcemap.

set package.json

```
{
    "name": "hexo-renderer-webpack-2",
    ...
    scripts: {
        "dev": "NODE_ENV=development hexo server"
    }
}
```

run

```
$ npm run dev
```

## Known Issues

* This project is not fully support webpack. You can't set node modules in entry.
* break complie when js has HTML tags.

## Links

- Hexo: https://hexo.io/
- Webpack: http://webpack.github.io/
