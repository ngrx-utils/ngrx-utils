workspace(name = "ngrx_utils")

# Add nodejs rules
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "b61adcfd9803687bc9963835d5426f636040776d3bef194760685c57e13dcaca",
    strip_prefix = "rules_nodejs-0.9.1",
    url = "https://github.com/bazelbuild/rules_nodejs/archive/0.9.1.tar.gz",
)

http_archive(
    name = "io_bazel_rules_webtesting",
    sha256 = "636c7a9ac2ca13a04d982c2f9c874876ecc90a7b9ccfe4188156122b26ada7b3",
    strip_prefix = "rules_webtesting-cfcaaf98553fee8e7063b5f5c11fd1b77e43d683",
    url = "https://github.com/bazelbuild/rules_webtesting/archive/cfcaaf98553fee8e7063b5f5c11fd1b77e43d683.zip",
)

# This commit matches the version of buildifier in angular/ngcontainer
# If you change this, also check if it matches the version in the angular/ngcontainer
# version in /.circleci/config.yml
BAZEL_BUILDTOOLS_VERSION = "fd9878fd5de921e0bbab3dcdcb932c2627812ee1"

http_archive(
    name = "com_github_bazelbuild_buildtools",
    sha256 = "27bb461ade23fd44ba98723ad98f84ee9c83cd3540b773b186a1bc5037f3d862",
    strip_prefix = "buildtools-%s" % BAZEL_BUILDTOOLS_VERSION,
    url = "https://github.com/bazelbuild/buildtools/archive/%s.zip" % BAZEL_BUILDTOOLS_VERSION,
)

# NOTE: this rule installs nodejs, npm, and yarn, but does NOT install
# your npm dependencies. You must still run the package manager.
load("@build_bazel_rules_nodejs//:defs.bzl", "check_bazel_version", "node_repositories", "yarn_install")

check_bazel_version("0.13.0")

node_repositories(package_json = ["//tools:package.json"])

# NOTE: this rule is needed only when using dev server.
http_archive(
    name = "io_bazel_rules_go",
    sha256 = "c1f52b8789218bb1542ed362c4f7de7052abcf254d865d96fb7ba6d44bc15ee3",
    url = "https://github.com/bazelbuild/rules_go/releases/download/0.12.0/rules_go-0.12.0.tar.gz",
)

load("@io_bazel_rules_go//go:def.bzl", "go_rules_dependencies", "go_register_toolchains")

go_rules_dependencies()

go_register_toolchains()

load("@io_bazel_rules_webtesting//web:repositories.bzl", "browser_repositories", "web_test_repositories")

web_test_repositories()

browser_repositories(
    chromium = True,
    firefox = True,
)

# Fetch and install the Sass rules
http_archive(
    name = "io_bazel_rules_sass",
    sha256 = "14536292b14b5d36d1d72ae68ee7384a51e304fa35a3c4e4db0f4590394f36ad",
    strip_prefix = "rules_sass-0.0.3",
    url = "https://github.com/bazelbuild/rules_sass/archive/0.0.3.tar.gz",
)

load("@io_bazel_rules_sass//sass:sass.bzl", "sass_repositories")

sass_repositories()

# Add TypeScript rules
http_archive(
    name = "build_bazel_rules_typescript",
    sha256 = "90bc07d3721bd64097f97ca37c345d64efa455c2de99af0b90b16bc8ac28b31c",
    strip_prefix = "rules_typescript-0.14.0",
    url = "https://github.com/bazelbuild/rules_typescript/archive/0.14.0.tar.gz",
)

# Setup TypeScript Bazel workspace
load("@build_bazel_rules_typescript//:defs.bzl", "ts_setup_workspace")

ts_setup_workspace()

# Add Angular rules
local_repository(
    name = "angular",
    path = "node_modules/@angular/bazel",
)

# Add rxjs
local_repository(
    name = "rxjs",
    path = "node_modules/rxjs/src",
)

####################################
# Bazel will fetch its own dependencies from npm.
# This makes it easier for ngrx users who use Bazel.
yarn_install(
    name = "ngrx_utils_compiletime_deps",
    package_json = "//tools:package.json",
    yarn_lock = "//tools:yarn.lock",
)
