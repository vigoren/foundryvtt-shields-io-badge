# Change Log

## 1.1.3 - Badge Styles

- Added an option to the system and version badges to choose the style you want to badge to display as. These styles are taken from shields.io's style list.

## 1.1.2 - Game System Versions

- Added a new options when generating Game System badges to show the version of the system that the module/world requires. 

## 1.1.1 - Dependency Update, Better Error Logs

- Added some more details to any logged errors to make them a bit more useful.
- Updated all dependencies to the latest versions.

## 1.1.0 - System Badge, Website

- Added a new badge for showing which system/systems a world or module support. Check out the readme for more details on how to use it!
- Updated the main landing page to allow for easy generation of the badges!
  - Select which badge you want to create.
  - Enter the URL for your system, module or world manifest.
  - Copy the generated URL and use.

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

