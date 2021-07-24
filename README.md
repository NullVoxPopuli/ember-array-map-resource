# ember-array-map-resource

[![npm version](https://badge.fury.io/js/ember-array-map-resource.svg)](https://badge.fury.io/js/ember-array-map-resource)
[![CI](https://github.com/NullVoxPopuli/ember-array-map-resource/actions/workflows/ci.yml/badge.svg?branch=main&event=push)](https://github.com/NullVoxPopuli/ember-array-map-resource/actions/workflows/ci.yml)

This addon provides a `useArrayMap` function which returns a resource that
reactively maps data per-element, so that when the overall collection is dirtied,
only the changed/new/removed elements affect the mapped collection.

This technique requires that your elements be mapped to some other reactive context
so that changes _within_ the element are appropriately reflected in your UI.
Examples below.


- [Installation](#installation)
- [Usage](#usage)
- [Public Types](#public-types)
- [Testing](#testing)
- [Contributing](#contributing)
- [Thanks](#thanks)

## Compatibility

* Ember.js v3.25+
* TypeScript v4.2+

## Installation

```bash
npm install ember-array-map-resource
# or
yarn add ember-array-map-resource
# or
ember install ember-array-map-resource
```

## Examples

WIP

## Usage

WIP

## Public Types

WIP

## Testing

WIP

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).


## Thanks

This library wouldn't be possible without the work of:
 - [@pzuraq](https://github.com/pzuraq)
 - [@josemarluedke](https://github.com/josemarluedke)

So much appreciate for the work both you have put in to Resources <3

