import { tracked } from '@glimmer/tracking';
import { setOwner } from '@ember/application';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { useArrayMap } from 'ember-array-map-resource';

import { testData, Wrapper } from './-helpers';

import type { TestRecord } from './-helpers';

module('useArrayMap', function (hooks) {
  setupTest(hooks);

  test('it works', async function (assert) {
    class Test {
      @tracked records: TestRecord[] = [];

      stuff = useArrayMap(this, {
        data: () => {
          assert.step('evaluate data thunk');

          return this.records;
        },
        map: (record) => {
          assert.step(`perform map on ${record.id}`);

          return new Wrapper(record);
        },
      });
    }

    let currentStuff: Wrapper[] = [];
    let instance = new Test();

    setOwner(instance, this.owner);

    assert.equal(instance.stuff.length, 0);
    assert.verifySteps(['evaluate data thunk']);

    let first = testData(1);
    let second = testData(2);

    instance.records = [first, second];
    assert.equal(instance.stuff.length, 2, 'length adjusted');
    assert.verifySteps(
      ['evaluate data thunk'],
      'we do not map yet because the data has not been accessed'
    );

    assert.ok(instance.stuff[0] instanceof Wrapper, 'access id:1');
    assert.ok(instance.stuff[1] instanceof Wrapper, 'access id:2');
    assert.verifySteps(['perform map on 1', 'perform map on 2']);

    assert.ok(instance.stuff[0] instanceof Wrapper, 'access id:1');
    assert.ok(instance.stuff[1] instanceof Wrapper, 'access id:2');
    assert.verifySteps([], 're-access does not re-map');

    // this tests the iterator
    currentStuff = [...instance.stuff];

    assert.ok(instance.stuff.records[0] instanceof Wrapper, 'mappedRecords id:1');
    assert.ok(instance.stuff.records[1] instanceof Wrapper, 'mappedRecords id:2');

    assert.strictEqual(currentStuff[0].record, first, 'object equality retained');
    assert.strictEqual(currentStuff[1].record, second, 'object equality retained');

    instance.records = [...instance.records, testData(3)];
    assert.equal(instance.stuff.length, 3, 'length adjusted');
    assert.verifySteps(
      ['evaluate data thunk'],
      'we do not map on the new object yet because the data has not been accessed'
    );

    assert.ok(instance.stuff[0] instanceof Wrapper, 'access id:1');
    assert.ok(instance.stuff[1] instanceof Wrapper, 'access id:2');
    assert.ok(instance.stuff[2] instanceof Wrapper, 'access id:3');
    assert.strictEqual(instance.stuff[0], currentStuff[0], 'original objects retained');
    assert.strictEqual(instance.stuff[1], currentStuff[1], 'original objects retained');
    assert.verifySteps(
      ['perform map on 3'],
      'only calls map once, even though the whole source data was re-created'
    );

    first.someValue = 'throwaway value';
    assert.verifySteps(
      [],
      'data thunk is not ran, because the tracked data consumed in the thunk was not changed'
    );
    assert.strictEqual(instance.stuff[0], currentStuff[0], 'original objects retained');
    assert.strictEqual(instance.stuff[1], currentStuff[1], 'original objects retained');
  });
});
