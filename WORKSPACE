workspace(name = "angular_mdl")

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# Add NodeJS rules (explicitly used for sass bundle rules)
http_archive(
  name = "build_bazel_rules_nodejs",
  sha256 = "88e5e579fb9edfbd19791b8a3c6bfbe16ae3444dba4b428e5efd36856db7cf16",
  urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/0.27.8/rules_nodejs-0.27.8.tar.gz"],
)

# Add sass rules
http_archive(
  name = "io_bazel_rules_sass",
  sha256 = "ea79647e5cd36867568d80811a951c7b3170791058f50a5cbd3d542627e78881",
  url = "https://github.com/bazelbuild/rules_sass/archive/1.17.3.zip",
  strip_prefix = "rules_sass-1.17.3",
)

load("@build_bazel_rules_nodejs//:defs.bzl", "check_bazel_version", "node_repositories", "yarn_install")

# The minimum bazel version to use with this repo is 0.18.0
check_bazel_version("0.18.0")

node_repositories(
  # For deterministic builds, specify explicit NodeJS and Yarn versions.
  node_version = "11.10.0",
  # Use latest yarn version to support integrity field (added in yarn 1.10)
  yarn_version = "1.12.3",
)

yarn_install(
  name = "npm",
  package_json = "//:package.json",
  # Ensure that the script is available when running `postinstall` in the Bazel sandbox.
  data = [
    "//:tools/npm/check-npm.js",
    "//:angular-tsconfig.json",
  ],
  yarn_lock = "//:yarn.lock",
)

# Install all bazel dependencies of the @ngdeps npm packages
load("@npm//:install_bazel_dependencies.bzl", "install_bazel_dependencies")
install_bazel_dependencies()

# Setup TypeScript Bazel workspace
load("@npm_bazel_typescript//:defs.bzl", "ts_setup_workspace")
ts_setup_workspace()

# Fetch transitive dependencies which are needed to use the karma rules.
load("@npm_bazel_karma//:package.bzl", "rules_karma_dependencies")
rules_karma_dependencies()

# Setup web testing. We need to setup a browser because the web testing rules for TypeScript need
# a reference to a registered browser (ideally that's a hermetic version of a browser)
load("@io_bazel_rules_webtesting//web:repositories.bzl", "web_test_repositories")
web_test_repositories()

load("@npm_bazel_karma//:browser_repositories.bzl", "browser_repositories")
browser_repositories()

# Fetch transitive dependencies which are needed to use the Sass rules.
load("@io_bazel_rules_sass//:package.bzl", "rules_sass_dependencies")
rules_sass_dependencies()

# Setup the Sass rule repositories.
load("@io_bazel_rules_sass//:defs.bzl", "sass_repositories")
sass_repositories()

# Temporarily add the Angular repository so that we can set up "ts_api_guardian".
# TODO(jelbourn): remove this once we can do all the same stuff via @npm//@angular
http_archive(
  name = "angular",
  sha256 = "a542f00adf5cafbcad24268d69da8e4746c22619699f29c3b3b0259d0ce52974",
  url = "https://github.com/angular/angular/archive/8.0.0-beta.6.zip",
  strip_prefix = "angular-8.0.0-beta.6",
)

# Only install the "ts-api-guardian" dependencies as we don't want to install the
# Angular dev dependencies which are not needed.
yarn_install(
    name = "ts-api-guardian_deps",
    package_json = "@angular//tools/ts-api-guardian:package.json",
    yarn_lock = "@angular//tools/ts-api-guardian:yarn.lock",
)

# Bring in bazel_toolchains for RBE setup configuration.
http_archive(
  name = "bazel_toolchains",
  sha256 = "67335b3563d9b67dc2550b8f27cc689b64fadac491e69ce78763d9ba894cc5cc",
  strip_prefix = "bazel-toolchains-cddc376d428ada2927ad359211c3e356bd9c9fbb",
  url = "https://github.com/bazelbuild/bazel-toolchains/archive/cddc376d428ada2927ad359211c3e356bd9c9fbb.tar.gz",
)

load("@bazel_toolchains//repositories:repositories.bzl", bazel_toolchains_repositories = "repositories")
bazel_toolchains_repositories()

load("@bazel_toolchains//rules:rbe_repo.bzl", "rbe_autoconfig")
rbe_autoconfig(
  name = "rbe_default",
  # We can't use the default "ubuntu16_04" RBE image provided by the autoconfig because we need
  # a specific Linux kernel that comes with "libx11" in order to run headless browser tests.
  repository = "asci-toolchain/nosla-ubuntu16_04-webtest",
  registry = "gcr.io",
  digest = "sha256:e874885f5e3d9ac0c0d3176e5369cb5969467dbf9ad8d42b862829cec8d84b9b",
  # Need to specify a base container digest in order to ensure that we can use the checked-in
  # platform configurations for the "ubuntu16_04" image. Otherwise the autoconfig rule would
  # need to pull the image and run it in order determine the toolchain configuration.
  # See: https://github.com/bazelbuild/bazel-toolchains/blob/master/rules/rbe_repo.bzl#L229
  base_container_digest = "sha256:da0f21c71abce3bbb92c3a0c44c3737f007a82b60f8bd2930abc55fe64fc2729",
)
