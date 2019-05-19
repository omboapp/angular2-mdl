import {mkdirpSync, writeFileSync} from 'fs-extra';
import {dest, src, task} from 'gulp';
import {buildConfig, composeRelease, sequenceTask} from 'material2-build-tools';
import {join} from 'path';
import {Bundler} from 'scss-bundle';
import {mdlPackage} from '../packages';

// There are no type definitions available for these imports.
const gulpRename = require('gulp-rename');

const distDir = buildConfig.outputDir;
const {sourceDir, outputDir} = mdlPackage;

/** Path to the directory where all releases are created. */
const releasesDir = join(distDir, 'releases');

// Path to the release output of material.
const releasePath = join(releasesDir, 'mdl');

// The entry-point for the scss theming bundle.
const themingEntryPointPath = join(sourceDir, 'common', 'theming', '_all-theme.scss');

// Output path for the scss theming bundle.
const themingBundlePath = join(releasePath, '_theming.scss');

// Matches all pre-built theme css files
const prebuiltThemeGlob = join(outputDir, '**/theming/prebuilt/*.css?(.map)');

// Matches all SCSS files in the different packages. Note that this glob is not used to build
// the bundle. It's used to identify Sass files that shouldn't be included multiple times.
const allScssDedupeGlob = join(buildConfig.packagesDir, '**/*.scss');

/**
 * Overwrite the release task for the `mdl` package. The `mdl` release will include special
 * files, like a bundled theming SCSS file or all prebuilt themes.
 */
task('mdl:build-release', ['mdl:prepare-release'], () => composeRelease(mdlPackage));

/**
 * Task that will build the `mdl` package. Special treatment for this package includes:
 * - Copying all prebuilt themes into the package
 * - Bundling theming scss into a single theming file
 */
task('mdl:prepare-release', sequenceTask(
  ['mdl:build'],
  ['mdl:copy-prebuilt-themes', 'mdl:bundle-theming-scss'],
));

/** Copies all prebuilt themes into the release package under `prebuilt-themes/` */
task('mdl:copy-prebuilt-themes', () => {
  return src(prebuiltThemeGlob)
    .pipe(gulpRename({dirname: ''}))
    .pipe(dest(join(releasePath, 'prebuilt-themes')));
});

/** Bundles all scss requires for theming into a single scss file in the root of the package. */
task('mdl:bundle-theming-scss', () => {
  // Instantiates the SCSS bundler and bundles all imports of the specified entry point SCSS file.
  // A glob of all SCSS files in the library will be passed to the bundler. The bundler takes an
  // array of globs, which will match SCSS files that will be only included once in the bundle.
  return new Bundler().Bundle(themingEntryPointPath, [allScssDedupeGlob]).then(result => {
    // The release directory is not created yet because the composing of the release happens when
    // this task finishes.
    mkdirpSync(releasePath);
    writeFileSync(themingBundlePath, result.bundledContent);
  });
});
