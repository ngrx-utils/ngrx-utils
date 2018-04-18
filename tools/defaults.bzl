"""Re-export of some bazel rules with repository-wide defaults."""
load("@build_bazel_rules_typescript//:defs.bzl", _ts_library="ts_library")
load("@angular//:index.bzl", _ng_module="ng_module", _ng_package="ng_package")
load("@build_bazel_rules_nodejs//:defs.bzl",
     _jasmine_node_test="jasmine_node_test")

DEFAULT_TSCONFIG = "//projects:tsconfig-build.json"
NGRX_UTILS_VERSION = "0.11.0-beta.3"
NG_VERSION = "^6.0.0 || ^6.0.0-rc.0"
NGRX_VERSION = "^6.0.0-beta.1"
RXJS_VERSION = "^5.6.0-forward-compat.0 || ^6.0.0-beta.0"

NGRX_UTILS_SCOPED_PACKAGES = ["@ngrx-utils/%s" % p for p in [
    "store",
]]

NGRX_UTILS_GLOBALS = dict({
    "tslib": "tslib",
}, **{p: p for p in NGRX_UTILS_SCOPED_PACKAGES})

PKG_GROUP_REPLACEMENTS = {
    "0.0.0-PLACEHOLDER": NGRX_UTILS_VERSION,
    "NG_VERSION": NG_VERSION,
    "NGRX_VERSION": NGRX_VERSION,
    "RXJS_VERSION": RXJS_VERSION,
    "\"NG_UPDATE_PACKAGE_GROUP\"": """[
      %s
    ]""" % ",\n      ".join(["\"%s\"" % s for s in NGRX_UTILS_SCOPED_PACKAGES])
}


def ts_library(tsconfig=None, node_modules=None, **kwargs):
    if not tsconfig:
        tsconfig = DEFAULT_TSCONFIG
    _ts_library(tsconfig=tsconfig, **kwargs)


def ts_test_library(node_modules=None, **kwargs):
    ts_library(testonly=1, tsconfig="//:tsconfig.spec.json", **kwargs)


def jasmine_node_test(node_modules=None, bootstrap=None, deps=[], **kwargs):
    if not bootstrap:
        bootstrap = ["ngrx_utils/tools/testing/bootstrap_node_tests.js"]
    _jasmine_node_test(
        bootstrap=bootstrap,
        deps=["//tools/testing:node"] + deps,
        **kwargs
    )


def ng_module(name, tsconfig=None, entry_point=None, **kwargs):
    if not tsconfig:
        tsconfig = DEFAULT_TSCONFIG
    if not entry_point:
        entry_point = "public_api.ts"
    _ng_module(name=name, flat_module_out_file=name,
               tsconfig=tsconfig, entry_point=entry_point, **kwargs)


def ng_package(name, readme_md=None, license_banner=None, globals={}, **kwargs):
    if not readme_md:
        readme_md = "//projects:README.md"
    if not license_banner:
        license_banner = "//projects:license-banner.txt"

    _ng_package(
        name=name,
        readme_md=readme_md,
        license_banner=license_banner,
        globals=dict(globals, **NGRX_UTILS_GLOBALS),
        replacements=PKG_GROUP_REPLACEMENTS,
        **kwargs)