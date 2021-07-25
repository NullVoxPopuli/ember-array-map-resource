import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { setComponentTemplate } from '@ember/component';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { useArrayMap } from 'ember-array-map-resource';

import { testData, Wrapper } from './-helpers';

import type { TestRecord } from './-helpers';

module('useArrayMap | rendering', function (hooks) {
  setupRenderingTest(hooks);

  test('it works', async function (assert) {
    class Test extends Component {
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

    setComponentTemplate(
      hbs`
        {{#each this.stuff as |wrapped|}}
          <output>{{wrapped.record.id}}</output>
        {{/each}}
      `,
      Test
    );

    this.setProperties({ Test });

    await render(hbs`<this.Test />`);

    assert.dom('output').doesNotExist();
    assert.verifySteps(['evaluate data thunk']);
  });
});
