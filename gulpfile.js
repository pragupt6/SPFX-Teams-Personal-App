'use strict';
const fs = require("fs");
// check if gulp dist was called
if (process.argv.indexOf('dist') !== -1) {
  // add ship options to command call
  process.argv.push('--ship');
}

const path = require('path');
const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
const gulpSequence = require('gulp-sequence');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

// Font loader configuration for webfonts
const fontLoaderConfig = {
  test: /\.(woff(2)?|ttf|eot|svg|woff)(\?v=\d+\.\d+\.\d+)?$/,
  use: [{
    loader: 'url-loader',
    options: {
      name: '[name].[ext]',
      outputPath: 'fonts/'
    }
  }]
};



// Create clean distrubution package
gulp.task('dist', gulpSequence('clean', 'bundle', 'package-solution'));
// Create clean development package
gulp.task('dev', gulpSequence('clean', 'bundle', 'package-solution'));



/**
 * Webpack Bundle Anlayzer
 * Reference and gulp task
 */
if (process.argv.indexOf('--analyze') !== -1 ||
  process.argv.indexOf('dist') !== -1 ||
  process.argv.indexOf('dev') !== -1) {

  const bundleAnalyzer = require('webpack-bundle-analyzer');

  build.configureWebpack.mergeConfig({

    additionalConfiguration: (generatedConfiguration) => {
      const lastDirName = path.basename(__dirname);
      const dropPath = path.join(__dirname, 'temp', 'stats');
      generatedConfiguration.plugins.push(new bundleAnalyzer.BundleAnalyzerPlugin({
        openAnalyzer: false,
        analyzerMode: 'static',
        reportFilename: path.join(dropPath, `${lastDirName}.stats.html`),
        generateStatsFile: true,
        statsFilename: path.join(dropPath, `${lastDirName}.stats.json`),
        logLevel: 'error'
      }));

      return generatedConfiguration;
    }

  });
}
build.configureWebpack.mergeConfig({

  additionalConfiguration: (generatedConfiguration) => {
    fs.writeFileSync("./temp/_webpack_config.json", JSON.stringify(generatedConfiguration, null, 2));
    //generatedConfiguration.module.rules.push(fontLoaderConfig);
    return generatedConfiguration;
  }

});

/**
 * Custom Framework Specific gulp tasks
 */


const argv = build.rig.getYargs().argv;
const useCustomServe = argv['custom-serve'];
const workbenchApi = require("@microsoft/sp-webpart-workbench/lib/api");

if (useCustomServe) {
  build.tslintCmd.enabled = false;

  const ensureWorkbenchSubtask = build.subTask('ensure-workbench-task', function (gulp, buildOptions, done) {
    this.log('Creating workbench.html file...');
    try {
      workbenchApi.default["/workbench"]();
    } catch (e) { }

    done();
  });

  build.rig.addPostBuildTask(build.task('ensure-workbench', ensureWorkbenchSubtask));
}
const postcss = require("gulp-postcss");
const atimport = require("postcss-import");
const purgecss = require("@fullhuman/postcss-purgecss");
const tailwind = require("tailwindcss");


const tailwindcss = build.subTask(
  "tailwindcss",
  function (gulp, buildOptions, done) {
    gulp
      .src("assets/tailwind.css")
      .pipe(
        postcss([
          atimport(),
          tailwind("./tailwind.config.js"),
          ...(buildOptions.args.ship
            ? [
              purgecss({
                content: ["src/**/*.tsx"],
                defaultExtractor: (content) =>
                  content.match(/[\w-/:]+(?<!:)/g) || [],
              }),
            ]
            : []),
        ])
      )
      .pipe(gulp.dest("assets/dist"));
    done();
  }
);
build.rig.addPreBuildTask(tailwindcss);


build.initialize(require('gulp'));

