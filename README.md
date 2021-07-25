# ember-array-map-resource

[![npm version](https://badge.fury.io/js/ember-array-map-resource.svg)](https://badge.fury.io/js/ember-array-map-resource)
[![CI](https://github.com/NullVoxPopuli/ember-array-map-resource/actions/workflows/ci.yml/badge.svg?branch=main&event=push)](https://github.com/NullVoxPopuli/ember-array-map-resource/actions/workflows/ci.yml)

This addon provides a `useArrayMap` function which returns a resource that
reactively maps data per-element, so that when the overall collection is dirtied,
only the changed/new/removed elements affect the mapped collection.

This technique requires that your elements be mapped to be object-like so that iteration
can rely on object identity to optimize loop iteration.


- [Installation](#installation)
- [Usage](#usage)
- [Public Types](#public-types)
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

## Usage

This is most useful for library authors that may not have control of _how_ an array of items
is updated. It's common in modern JS to replace entire arrays when adding/removing/changing
items in arrays -- `useArrayMap` provides a technique to re-optimize how updates within your
library are handled. Folks can replace an entire array, and _as long as object-identity is
maintained_.

```js
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { useArrayMap } from 'ember-array-map-resource';

export default class MyComponent extends Component {
  @tracked records = [];

  mappedRecords = useArrayMap(this, {
    data: () => this.records,
    map: (record) => someTransform(record)
  });

  @action someTransform(record) {
    return /* ... ✂️  ... */
  }
}
```
```hbs
{{!-- even if this.records is re-set entirely, mappedRecords will optimize iteration --}}
{{#each this.mappedRecords as |mappedRecord|}}
  ...
  {{!--
    within the each body, code will only be executed once for each
    - new record
    - replaced record
  --}}
{{/each}}
```

NOTE: `each` performance is handled by ember, and tweaks to its behavior can be tweaked.
SEE: https://guides.emberjs.com/release/components/looping-through-lists/

The above example could be acheived with inline-helpers and without a resource via:

```js
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class MyComponent extends Component {
  @tracked records = [];

  @action someTransform(record) {
    return /* ... ✂️  ... */
  }
}
```
```hbs
{{!-- even if this.records is re-set entirely, mappedRecords will optimize iteration --}}
{{#each this.records as |record|}}
  {{#let (this.someTransform record) as |mappedRecord|}}
    {{!-- expect same loop optimizations as above --}}
  {{/let}}
{{/each}}
```

So, why would you want to use a resource if you can acheive the same with a `let`?
As a library author, you may be transforming data that you yourself don't have a say in
how it gets rendered.  For example, if your component template were `{{yield this.records}}`,
the user would be required to both transform and optimize their loop.
However, with `useArrayMap` and `{{yield this.mappedRecords}}`, the user can be naïve about
the implementation details of the list, and still get performance benefits.

This could be helpful with
 - headless list implementations, where the user provides the entirety of the UI.
 - javascript-only map-loop optimizations

## Public Types

- `ArrayMap<Element extends object, MapTo>` - the return type from `useArrayMap`
  - iterable
  - array-index access

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).


## Thanks

This library wouldn't be possible without the work of:
 - [@pzuraq](https://github.com/pzuraq)
 - [@josemarluedke](https://github.com/josemarluedke)

So much appreciate for the work both you have put in to Resources <3

