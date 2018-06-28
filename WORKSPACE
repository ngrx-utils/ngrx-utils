workspace(name = "ngrx_utils")

#
# Download Bazel toolchain dependencies as needed by build actions
#

git_repository(
    name = "build_bazel_rules_nodejs",
    remote = "https://github.com/bazelbuild/rules_nodejs.git",
    tag = "0.10.0",
)

http_archive(
    name = "io_bazel_rules_webtesting",
    sha256 = "cecc12f07e95740750a40d38e8b14b76fefa1551bef9332cb432d564d693723c",
    strip_prefix = "rules_webtesting-0.2.0",
    urls = ["https://github.com/bazelbuild/rules_webtesting/archive/v0.2.0.zip"],
)

git_repository(
    name = "build_bazel_rules_typescript",
    remote = "https://github.com/bazelbuild/rules_typescript.git",
    tag = "0.15.0",
)

git_repository(
    name = "io_bazel_rules_go",
    remote = "https://github.com/bazelbuild/rules_go.git",
    tag = "0.12.1",
)

git_repository(
    name = "com_github_bazelbuild_buildtools",
    remote = "https://github.com/bazelbuild/buildtools.git",
    tag = "0.12.0",
)

# Fetching the Bazel source code allows us to compile the Skylark linter
git_repository(
    name = "io_bazel",
    remote = "https://github.com/bazelbuild/bazel.git",
    tag = "0.15.0",
)

# NOTE: this rule installs nodejs, npm, and yarn, but does NOT install
# your npm dependencies. You must still run the package manager.
load("@build_bazel_rules_nodejs//:defs.bzl", "check_bazel_version", "node_repositories")

check_bazel_version("0.15.0")

node_repositories(package_json = ["//:package.json"])

load("@io_bazel_rules_go//go:def.bzl", "go_rules_dependencies", "go_register_toolchains")

go_rules_dependencies()

go_register_toolchains()

load("@io_bazel_rules_webtesting//web:repositories.bzl", "browser_repositories", "web_test_repositories")

web_test_repositories()

browser_repositories(
    chromium = True,
    firefox = True,
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
