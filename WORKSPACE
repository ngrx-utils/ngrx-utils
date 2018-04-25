workspace(name = "ngrx_utils")

# Add nodejs rules
http_archive(
    name = "build_bazel_rules_nodejs",
    url = "https://github.com/bazelbuild/rules_nodejs/archive/0.7.0.tar.gz",
    sha256 = "e9e1f2e8e348d9355a28a4ef3cddceb353dcce04b5bf5032715a1f0ec1046f84",
    strip_prefix = "rules_nodejs-0.7.0",
)

# Add bazel build tools
http_archive(
    name = "com_github_bazelbuild_buildtools",
    url = "https://github.com/bazelbuild/buildtools/archive/0.11.1.tar.gz",
    sha256 = "ad73e283e023380e6f126e6a56c8b9c0a3f720198a8b300cef9ebed6f21fe6ce",
    strip_prefix = "buildtools-0.11.1",
)

# NOTE: this rule installs nodejs, npm, and yarn, but does NOT install
# your npm dependencies. You must still run the package manager.
load("@build_bazel_rules_nodejs//:defs.bzl", "check_bazel_version", "node_repositories")

check_bazel_version("0.11.1")

node_repositories(package_json = ["//:package.json"])

# NOTE: this rule is needed only when using dev server.
http_archive(
    name = "io_bazel_rules_go",
    sha256 = "f70c35a8c779bb92f7521ecb5a1c6604e9c3edd431e50b6376d7497abc8ad3c1",
    url = "https://github.com/bazelbuild/rules_go/releases/download/0.11.0/rules_go-0.11.0.tar.gz",
)

load("@io_bazel_rules_go//go:def.bzl", "go_rules_dependencies", "go_register_toolchains")

go_rules_dependencies()

go_register_toolchains()

# Fetch and install the Sass rules
git_repository(
    name = "io_bazel_rules_sass",
    remote = "https://github.com/bazelbuild/rules_sass.git",
    tag = "0.0.3",
)

load("@io_bazel_rules_sass//sass:sass.bzl", "sass_repositories")

sass_repositories()

# Add TypeScript rules
http_archive(
    name = "build_bazel_rules_typescript",
    url = "https://github.com/bazelbuild/rules_typescript/archive/0.12.2.tar.gz",
    strip_prefix = "rules_typescript-0.12.2",
    sha256 = "3708b2f74f32a5f3c6e28be0b82f6db8723d81c0beb7d1b038e5be8a688d23d3",
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
