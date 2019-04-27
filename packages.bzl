# List of all components / subpackages.

MDL_PACKAGES = [
  "badge",
  "button",
  "card",
  "checkbox",
  "chips",
  "common",
  "dialog",
  "dialog-outlet",
  "icon",
  "icon-toggle",
  "layout",
  "list",
  "menu",
  "popover",
  "progress",
  "radio",
  "select",
  "shadow",
  "slider",
  "snackbar",
  "spinner",
  "switch",
  "table",
  "tabs",
  "textfield",
  "tooltip",
]

MDL_TARGETS = ["//src/lib:mdl"] + ["//src/lib/%s" % p for p in MDL_PACKAGES]

# List that references the sass libraries for each `@angular/mdl` package. This can be used to create
# the theming scss-bundle or to specify dependencies for the all-theme.scss file.
MDL_SCSS_LIBS = [
  "//src/lib/%s:%s_scss_lib" % (p, p.replace('-', '_')) for p in MDL_PACKAGES
]

# Each individual package uses a placeholder for the version of Angular to ensure they're
# all in-sync. This map is passed to each ng_package rule to stamp out the appropriate
# version for the placeholders.
ANGULAR_PACKAGE_VERSION = ">=6.0.0-beta.0 <9.0.0"
VERSION_PLACEHOLDER_REPLACEMENTS = {
  "0.0.0-NG": ANGULAR_PACKAGE_VERSION,
}

# Base rollup globals for everything in the repo.
ROLLUP_GLOBALS = {
  'tslib': 'tslib',
  'moment': 'moment',
  '@angular/mdl': 'ng.mdl',
}

# Rollup globals for material subpackages, e.g., {"@angular/mdl/list": "ng.mdl.list"}
ROLLUP_GLOBALS.update({
  "@angular/mdl/%s" % p: "ng.mdl.%s" % p for p in MDL_PACKAGES
})

# UMD bundles for Angular packages and subpackges we depend on for development and testing.
ANGULAR_LIBRARY_UMDS = [
  "@npm//node_modules/@angular/animations:bundles/animations-browser.umd.js",
  "@npm//node_modules/@angular/animations:bundles/animations.umd.js",
  "@npm//node_modules/@angular/common:bundles/common-http-testing.umd.js",
  "@npm//node_modules/@angular/common:bundles/common-http.umd.js",
  "@npm//node_modules/@angular/common:bundles/common-testing.umd.js",
  "@npm//node_modules/@angular/common:bundles/common.umd.js",
  "@npm//node_modules/@angular/compiler:bundles/compiler-testing.umd.js",
  "@npm//node_modules/@angular/compiler:bundles/compiler.umd.js",
  "@npm//node_modules/@angular/core:bundles/core-testing.umd.js",
  "@npm//node_modules/@angular/core:bundles/core.umd.js",
  "@npm//node_modules/@angular/elements:bundles/elements.umd.js",
  "@npm//node_modules/@angular/forms:bundles/forms.umd.js",
  "@npm//node_modules/@angular/platform-browser-dynamic:bundles/platform-browser-dynamic-testing.umd.js",
  "@npm//node_modules/@angular/platform-browser-dynamic:bundles/platform-browser-dynamic.umd.js",
  "@npm//node_modules/@angular/platform-browser:bundles/platform-browser-animations.umd.js",
  "@npm//node_modules/@angular/platform-browser:bundles/platform-browser-testing.umd.js",
  "@npm//node_modules/@angular/platform-browser:bundles/platform-browser.umd.js",
  "@npm//node_modules/@angular/router:bundles/router.umd.js",
]
