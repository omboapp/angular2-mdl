import {BuildPackage} from 'material2-build-tools';

/*
export const cdkPackage = new BuildPackage('cdk');
*/
// export const mdlPackage = new BuildPackage('mdl', [cdkPackage]);
export const mdlPackage = new BuildPackage('mdl');
/*
export const cdkExperimentalPackage = new BuildPackage('cdk-experimental', [cdkPackage]);
export const mdlExperimentalPackage = new BuildPackage('mdl-experimental', [mdlPackage]);
export const momentAdapterPackage = new BuildPackage('material-moment-adapter', [mdlPackage]);
export const examplesPackage = new BuildPackage('mdl-examples', [
  cdkPackage,
  cdkExperimentalPackage,
  mdlPackage,
  mdlExperimentalPackage,
  momentAdapterPackage
]);
*/

// The `mdl` package re-exports its secondary entry-points at the root so that all of the
// components can still be imported through `@angular/mdl`.
mdlPackage.exportsSecondaryEntryPointsAtRoot = true;

/*
// Some Material Design Lite experimental secondary entry-points include SCSS files that should be exposed
// individually at the release output root. This is different in the mdl package because here a
// full SCSS bundle will be generated.
cdkPackage.copySecondaryEntryPointStylesToRoot = true;
mdlExperimentalPackage.copySecondaryEntryPointStylesToRoot = true;

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
  mdlExperimentalPackage,
  momentAdapterPackage,
  examplesPackage
*/
];
