# Change Log

## 1.0.5 - World.json Support

- Added support for world.json files to display the core version that was used to create the world.

## 1.0.4 - Fixes

- Fixed an issue if minimumCoreVersion property is not specified in the modules manifest.

## 1.0.3 - Fixes

- Fix for the new way FoundryVTT does their release versions. You can specify a minimumCoreVersion of a specific release eg, 9.123 but have a compatibleCoreVersion of 9 to indicate it will work with all version 9 releases above the minimumCoreVersion. If this scenario is encountered the bade will display the version as 9.123+.
- Changed the grey color of the badge to match the grey color of other shield IO badges.

## 1.0.2 - Bug Fix

- Fixed a bug where manifests that included numbers for compatible versions would fail to load properly.


## v1.0.1 - Fixes

A small fix with this release:

- Updated the Label on the badge so that if only 1 version of foundry is supported the text says version instead of versions.

## v1.0.0 - Initial Release

This is the initial release of the service. Only a single badge is currently supported it is:

- **Supported Foundry Version**: This route will read a package's module.json file and generate a badge the details the versions of Foundry the package works with. More details can be found [here](./README.md#supported-foundry-version).

