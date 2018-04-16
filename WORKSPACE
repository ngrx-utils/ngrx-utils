workspace(name = "ngrx_utils")

load("@bazel_tools//tools/build_defs/repo:git.bzl", "git_repository")

# Add nodejs rules
git_repository(
    name = "build_bazel_rules_nodejs",
    remote = "https://github.com/bazelbuild/rules_nodejs.git",
    tag = "0.7.0",  # check for the latest tag when you install
)

# NOTE: this rule installs nodejs, npm, and yarn, but does NOT install
# your npm dependencies. You must still run the package manager.
load("@build_bazel_rules_nodejs//:defs.bzl", "check_bazel_version", "node_repositories")

check_bazel_version("0.12.0")

node_repositories(package_json = ["//:package.json"])

# Add TypeScript rules
local_repository(
    name = "build_bazel_rules_typescript",
    path = "node_modules/@bazel/typescript",
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
