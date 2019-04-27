import {BuildPackage, buildConfig} from 'material2-build-tools';
import {join} from 'path';

/*
export const cdkPackage = new BuildPackage('cdk');
*/
// export const mdlPackage = new BuildPackage('mdl', [cdkPackage]);
export const mdlPackage = new BuildPackage('mdl');
/*
export const cdkExperimentalPackage = new BuildPackage('cdk-experimental', [cdkPackage]);
export const materialExperimentalPackage = new BuildPackage('material-experimental',
    [mdlPackage]);
export const momentAdapterPackage = new BuildPackage('material-moment-adapter', [mdlPackage]);
export const examplesPackage = new BuildPackage('material-examples', [
  cdkPackage,
  cdkExperimentalPackage,
  mdlPackage,
  momentAdapterPackage
]);
*/

// The `mdl` package re-exports its secondary entry-points at the root so that all of the
// components can still be imported through `@angular/mdl`.
mdlPackage.exportsSecondaryEntryPointsAtRoot = true;

// To avoid refactoring of the project the `mdl` package will map to the source path `lib/`.
mdlPackage.sourceDir = join(buildConfig.packagesDir, 'lib');

/*
// Some CDK secondary entry-points include SCSS files that should be exposed individually at the
// release output root. This is different in the `mdl` package because here a full SCSS bundle
// will be generated.
cdkPackage.copySecondaryEntryPointStylesToRoot = true;

// Build and copy the schematics of the CDK and `mdl` package.
cdkPackage.hasSchematics = true;
*/
mdlPackage.hasSchematics = false;

/** List of all build packages defined for this project. */
export const allBuildPackages = [
/*
  cdkPackage,
*/
  mdlPackage,
/*
  cdkExperimentalPackage,
  materialExperimentalPackage,
  momentAdapterPackage,
  examplesPackage
*/
];
