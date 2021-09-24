/* eslint-disable @typescript-eslint/ban-types */
import { LifecycleResource } from 'ember-resources';

export interface ArrayMapOptions<Element extends object, MapTo> {
  data: () => Element[];
  map: (element: Element) => MapTo;
}

interface ArrayMapArgs<Element extends object, MapTo> {
  positional: [Element[]];
  named: {
    map: (element: Element) => MapTo;
  };
}

export class TrackedArrayMap<Element extends object, MappedTo> extends LifecycleResource<
  ArrayMapArgs<Element, MappedTo>
> {
  #map = new WeakMap<Element, MappedTo>();

  // @private
  get #records(): Element[] {
    return this.args.positional[0];
  }

  // public
  get records() {
    return [...this];
  }

  // @public
  get length() {
    return this.#records.length;
  }

  // @private
  at(i: number) {
    let record = this.#records[i];
    let value = this.#map.get(record);

    if (!value) {
      let { map } = this.args.named;

      value = map(record);
      this.#map.set(record, value);
    }

    return value;
  }

  // @public
  [Symbol.iterator]() {
    let i = 0;

    return {
      next: () => {
        if (i >= this.length) {
          return { done: true };
        }

        let value = this.at(i);

        i++;

        return {
          value,
          done: false,
        };
      },
    };
  }
}
