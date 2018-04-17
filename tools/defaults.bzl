"""Re-export of some bazel rules with repository-wide defaults."""
load("@build_bazel_rules_nodejs//:defs.bzl", _npm_package = "npm_package")
load("@build_bazel_rules_typescript//:defs.bzl", _ts_library = "ts_library", _ts_web_test = "ts_web_test")
load("//packages/bazel:index.bzl", _ng_module = "ng_module", _ng_package = "ng_package")

DEFAULT_TSCONFIG = "//projects:tsconfig-build.json"

# Packages which are versioned together on npm
ANGULAR_SCOPED_PACKAGES = ["@angular/%s" % p for p in [
  # core should be the first package because it's the main package in the group
  # this is significant for Angular CLI and "ng update" specifically, @angular/core
  # is considered the identifier of the group by these tools.
  "core",
  "bazel",
  "common",
  "compiler",
  "compiler-cli",
  "animations",
  "elements",
  "platform-browser",
  "platform-browser-dynamic",
  "forms",
  "http",
  "platform-server",
  "platform-webworker",
  "platform-webworker-dynamic",
  "upgrade",
  "router",
  "language-service",
  "service-worker",
]]

PKG_GROUP_REPLACEMENTS = {
    "\"NG_UPDATE_PACKAGE_GROUP\"": """[
      %s
    ]""" % ",\n      ".join(["\"%s\"" % s for s in ANGULAR_SCOPED_PACKAGES])
}

def ts_library(tsconfig = None, **kwargs):
  if not tsconfig:
    tsconfig = DEFAULT_TSCONFIG
  _ts_library(tsconfig = tsconfig, **kwargs)

def ng_module(name, tsconfig = None, entry_point = None, **kwargs):
  if not tsconfig:
    tsconfig = DEFAULT_TSCONFIG
  if not entry_point:
    entry_point = "public_api.ts"
  _ng_module(name = name, flat_module_out_file = name, tsconfig = tsconfig, entry_point = entry_point, **kwargs)

def ng_package(name, readme_md = None, license_banner = None, **kwargs):
  if not readme_md:
    readme_md = "//packages:README.md"
  if not license_banner:
    license_banner = "//packages:license-banner.txt"

  _ng_package(
      name = name,
      readme_md = readme_md,
      license_banner = license_banner,
      replacements = PKG_GROUP_REPLACEMENTS,
      **kwargs)

def npm_package(name, replacements = {}, **kwargs):
  _npm_package(
      name = name,
      replacements = dict(replacements, **PKG_GROUP_REPLACEMENTS),
      **kwargs)

def ts_web_test(bootstrap = [], deps = [], **kwargs):
  if not bootstrap:
    bootstrap = ["//:web_test_bootstrap_scripts"]
  local_deps = [
    "//:node_modules/tslib/tslib.js",
    "//tools/testing:browser",
  ] + deps

  _ts_web_test(
      bootstrap = bootstrap,
      deps = local_deps,
      **kwargs)