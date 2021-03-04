# nuxt-podium-module

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![License][license-src]][license-href]
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)


## Features

- Zero configuration
- Hot reload support
- Sandbox to manage events

## Quick Setup

1. Add `nuxt-podium-module` dependency to your project:

```bash
#using yarn
yarn add --dev nuxt-podium-module
# using npm
npm install --save-dev nuxt-podium-module
```

## Configure

Then, add `nuxt-podium-module` section in `nuxt.config.js`:

```js[nuxt.config.js]
export default {
  nuxt-podium-module: {
    // Options
  }
}
```

### Options

| Option         | type | default  |  description
|----------------|---|---|---|---|
|  podletOptions |  | {} |  used to add the podlet options, to more information you can read the podium-lib documentation [here](https://podium-lib.io/docs/podlet/getting_started) |
|  sandbox | boolean, SandboxOption  | false  | used to simulate events into your app  |

#### podletOptions
|  Option     | type         | default      | description  |
| ----------- | -------- | ---------------- | ----- |
| name        | string   | 'generic'        | used to name the application |
| version     | string   | '0.0.0'          | version of your app |
| pathname    | string   | '/'              | path of your app |
| manifest    | string   | '/manifest.json' | path to get manifest of your app |
| development | boolean  | false            | used to deploy app in mode development |

podlet option example:

```js
podletOptions: {
  name: 'myPodletName', // required
  version: '1.0.0', // required
  pathname: '/', // required
  manifest: '/manifest.json', // optional
  development: true, // optional, defaults to false
},
```

#### Sandbox Options
|  Option     | type         | default      | description  |
| ----------- | -------- | ---------------- | ----- |
| events        | array of events  | []       | used to give initial events |

sandbox option example:
```js
sandbox: {
  events: [
    {
      channel: 'fe-section-header',
      topic: 'auth',
      payload: {
        user: {
          name: 'User Test 2',
        }
      }
    }
  ]
}
```
## Development

1. Clone this repository
2. Install dependencies using `yarn install`
3. Start storybook server using `yarn dev`

## License

[MIT License](./LICENSE)

Copyright (c)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-podium-module/latest.svg
[npm-version-href]: https://npmjs.com/package/nuxt-podium-module

[npm-downloads-src]: https://img.shields.io/npm/dt/nuxt-podium-module.svg
[npm-downloads-href]: https://npmjs.com/package/nuxt-podium-module

[github-actions-ci-src]: https://github.com/natoehv/nuxt-podium-module/workflows/ci/badge.svg
[github-actions-ci-href]: https://github.com/natoehv/nuxt-podium-module/actions?query=workflow%3Aci

[codecov-src]: https://img.shields.io/codecov/c/github/natoehv/nuxt-podium-module.svg
[codecov-href]: https://codecov.io/gh/natoehv/nuxt-podium-module

[license-src]: https://img.shields.io/npm/l/nuxt-podium-module.svg
[license-href]: https://npmjs.com/package/nuxt-podium-module