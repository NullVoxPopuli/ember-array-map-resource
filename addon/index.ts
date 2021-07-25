/* eslint-disable @typescript-eslint/ban-types */
import { useResource } from 'ember-resources';

import { TrackedArrayMap } from './-private/resources/array-map';

import type { ArrayMapOptions } from './-private/resources/array-map';

type IterableArrayMap<MapTo> = Iterable<MapTo> & Iterator<MapTo>;

interface _ArrayMapWithIndexAccess<Element extends object, MapTo>
  extends TrackedArrayMap<Element, MapTo> {
  [index: number]: MapTo;
}

export type ArrayMap<Element extends object, MapTo> = _ArrayMapWithIndexAccess<Element, MapTo> &
  IterableArrayMap<MapTo>;

/**
 * Reactivily apply a `map` function to each element in an array,
 * persisting map-results for each object, based on identity.
 *
 * @param {object} [destroyable] parent destroyable context, usually `this`
 * @param {ArrayMapOptions<Element, MapTo>} [options] object specifying the map function and the data to use
 * @param {(element: Element) => MapTo} [options.map] the map function
 * @param {() => Element[]} [options.data] a thunk that returns the array to map over. This should access tracked data so that the Resources knows when to update.
 *
 * @return {Proxy<TrackedArrayMap>} an object that behaves like an array. This shouldn't be modified directly. Instead, you can freely modify the data returned by the `data` function, which should be tracked in order to benefit from this abstraction.
 *
 * @example
 *
 * ```js
 *  class MyClass {
 *    stuff = useArrayMap(this, {
 *      data: () => this.records,
 *      map: (record) => new SomeWrapper(record),
 *    }),
 *  }
 * ```
 */
export function useArrayMap<Element extends object, MapTo>(
  destroyable: object,
  { map, data }: ArrayMapOptions<Element, MapTo>
) {
  let resource = useResource<TrackedArrayMap<Element, MapTo>>(destroyable, TrackedArrayMap, () => {
    let reified = data();

    return { positional: [reified], named: { map } };
  });

  /**
   * This is what allows square-bracket index-access to work.
   */
  return new Proxy(resource, {
    get(target, property, receiver) {
      if (typeof property === 'string') {
        let parsed = parseInt(property, 10);

        if (!isNaN(parsed)) {
          return target.at(parsed);
        }
      }

      return Reflect.get(target, property, receiver);
    },
  }) as unknown as ArrayMap<Element, MapTo>;
}
