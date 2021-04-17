![Status](https://img.shields.io/website?down_color=red&down_message=offline&up_color=green&up_message=online&url=https%3A%2F%2Ffoundryshields.com%2F)
![License](https://img.shields.io/github/license/vigoren/foundryvtt-shields-io-badge)
![Version](https://img.shields.io/github/package-json/v/vigoren/foundryvtt-shields-io-badge)

# FoundryVTT ShieldsIO Badges

This repository provides a basic service that can be used to generate ShieldsIO badges for your own Foundry project read me pages.

This project is hosted at [https://foundryshields.com/](https://foundryshields.com/) to provide free access to generating the endpoint JSON that can then be used by [ShieldsIO endpoint route](https://shields.io/endpoint).

You can use this repository to host your own instance if you would prefer.

## Badges

### Supported Foundry Version

Some FoundryVTT modules support more than one version of core foundry. This badge provides a simple way to display that on your projects read me page. All you need is a link to your current manifest file.

This badge checks the values of `minimumCoreVersion` and `compatibleCoreVersion` in the Foundry manifest file. If they are the same or one is missing only one will be shown otherwise the range between the two values will be shown.

The URL to use for this is `https://foundryshields.com/version?url=:LinkToManifest`

Simply replace :LinkToManifest with the actual link to your manifest to generate the JSON used by ShieldsIO to generate a badge. The final URL to ShieldsIO would look like `https://img.shields.io/endpoint?url=https://foundryshields.com/version?url=:LinkToManifest`

#### Examples

An instance where both `minimumCoreVersion` and `compatibleCoreVersion` are the same value:

`https://img.shields.io/endpoint?url=https://foundryshields.com/version?url=https://github.com/vigoren/foundryvtt-simple-calendar/releases/download/v1.2.0/module.json`

![](https://img.shields.io/endpoint?url=https://foundryshields.com/version?url=https://github.com/vigoren/foundryvtt-simple-calendar/releases/download/v1.2.0/module.json)

An instance where `minimumCoreVersion` and `compatibleCoreVersion` are different:

`https://img.shields.io/endpoint?url=https://foundryshields.com/version?url=https://github.com/vigoren/foundryvtt-simple-calendar/releases/download/v1.2.20/module.json`

![](https://img.shields.io/endpoint?url=https://foundryshields.com/version?url=https://github.com/vigoren/foundryvtt-simple-calendar/releases/download/v1.2.20/module.json)

