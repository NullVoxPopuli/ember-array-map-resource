import { tracked } from '@glimmer/tracking';
import { setOwner } from '@ember/application';
import { settled } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { useArrayMap } from 'ember-array-map-resource';

module('Unit | useArrayMap', function (hooks) {
  setupTest(hooks);

  class Wrapper {
    constructor(public record: unknown) {}
  }

  test('it works', async function (assert) {
    class Test {
      @tracked records = [];

      stuff = useArrayMap(this, {
        data: () => this.records,
        map: (record) => new Wrapper(record),
      });
    }

    let instance = new Test();

    setOwner(instance, this.owner);

    assert.equal(instance.stuff.length, 0);

    await settled();
  });
});
