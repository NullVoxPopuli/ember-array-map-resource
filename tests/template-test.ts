import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { setComponentTemplate } from '@ember/component';
import { helper } from '@ember/component/helper';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { useArrayMap } from 'ember-array-map-resource';

import { testData, Wrapper } from './-helpers';

import type { TestRecord } from './-helpers';

module('useArrayMap | rendering', function (hooks) {
  setupRenderingTest(hooks);

  test('it works', async function (assert) {
    let step = helper(([text]: [string]) => assert.step(text));

    class Context {
      @tracked records: TestRecord[] = [];
    }

    class Test extends Component<{ ctx: Context }> {
      step = step;

      stuff = useArrayMap(this, {
        data: () => {
          assert.step('evaluate data thunk');

          return this.args.ctx.records;
        },
        map: (record) => {
          assert.step(`perform map on ${record.id}`);

          return new Wrapper(record);
        },
      });
    }

    setComponentTemplate(
      hbs`
        {{#each this.stuff as |wrapped index|}}
          {{this.step (concat "each loop - id:" wrapped.record.id " @ idx:" index)}}
          <output>{{wrapped.record.id}}</output>
        {{/each}}
      `,
      Test
    );

    let ctx = new Context();

    this.setProperties({ Test, ctx });

    await render(hbs`<this.Test @ctx={{this.ctx}} />`);

    assert.dom('output').doesNotExist();
    assert.verifySteps(['evaluate data thunk']);

    // Add first element
    ctx.records = [testData(1)];
    await settled();
    assert.dom('output').exists({ count: 1 });
    assert.verifySteps(['evaluate data thunk', 'perform map on 1', 'each loop - id:1 @ idx:0']);

    // Add second element
    ctx.records = [...ctx.records, testData(2)];
    await settled();
    assert.dom('output').exists({ count: 2 });
    assert.verifySteps(['evaluate data thunk', 'perform map on 2', 'each loop - id:2 @ idx:1']);

    // Add two elements at once
    ctx.records = [...ctx.records, testData(3), testData(4)];
    await settled();
    assert.dom('output').exists({ count: 4 });
    assert.verifySteps([
      'evaluate data thunk',
      'perform map on 3',
      'perform map on 4',
      'each loop - id:3 @ idx:2',
      'each loop - id:4 @ idx:3',
    ]);

    // Change one of the elements
    ctx.records = [ctx.records[0], testData(5), ctx.records[2], ctx.records[3]];
    await settled();
    assert.dom('output').exists({ count: 4 }, 'number of each iterations remains');
    assert.verifySteps(
      ['evaluate data thunk', 'perform map on 5', 'each loop - id:5 @ idx:1'],
      'map occurs only on the new element, each loop only evaluates for the replaced element'
    );

    // Removing the first element
    ctx.records = [ctx.records[1], ctx.records[2], ctx.records[3]];
    await settled();
    assert.dom('output').exists({ count: 3 }, 'one less iteration');
    assert.verifySteps(
      [
        'evaluate data thunk',
        'each loop - id:5 @ idx:0',
        'each loop - id:3 @ idx:1',
        'each loop - id:4 @ idx:2',
      ],
      'this is current behavior, but is this a bug?'
    );
    // -- it seems the index part of the loop is tracked data that is consumed by default, so
    //    because the index of everything changed, the entire list re-renders.
    //    there must be a way around that, yeah?
    // assert.verifySteps(['evaluate data thunk'], 'no map occurs, because the VM handles removal');
  });
});
