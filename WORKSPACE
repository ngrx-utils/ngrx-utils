workspace(name = "ngrx_utils")

# Add nodejs rules
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "a672bbb4eb8c49363942fe9a491f35214b5d7a0000c86e0152ea8cd3261b1c12",
    strip_prefix = "rules_nodejs-0.8.0",
    url = "https://github.com/bazelbuild/rules_nodejs/archive/0.8.0.tar.gz",
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
load("@build_bazel_rules_nodejs//:defs.bzl", "check_bazel_version", "node_repositories")

check_bazel_version("0.13.0")

node_repositories(package_json = ["//:package.json"])

# NOTE: this rule is needed only when using dev server.
http_archive(
    name = "io_bazel_rules_go",
    sha256 = "c1f52b8789218bb1542ed362c4f7de7052abcf254d865d96fb7ba6d44bc15ee3",
    url = "https://github.com/bazelbuild/rules_go/releases/download/0.12.0/rules_go-0.12.0.tar.gz",
)

load("@io_bazel_rules_go//go:def.bzl", "go_rules_dependencies", "go_register_toolchains")

go_rules_dependencies()

go_register_toolchains()

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
    sha256 = "d1530d89304e914be56ec827a1c3e2e9e316445ae3b9962743be7c2f8264650d",
    strip_prefix = "rules_typescript-0.13.0",
    url = "https://github.com/bazelbuild/rules_typescript/archive/0.13.0.tar.gz",
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
