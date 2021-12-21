/* eslint-disable no-console */
import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';
import { action } from '@ember/object';
import Service from '@ember/service';

import { freshArray, log } from 'dummy/utils';
import { useArrayMap } from 'ember-array-map-resource';

const DEFAULT_ITEM_COUNT = 4;

export default class ArrayService extends Service {
  @tracked itemCount = DEFAULT_ITEM_COUNT;
  @tracked records = freshArray(this.itemCount);
  @tracked renderTime: number | undefined;

  mappedRecords = useArrayMap(this, {
    data: () => this.records,
    // Create new object to demonstrate what the arrayMap does, re: iteration optimization
    map: (record) => ({ newObject: true, ...record }),
  });

  @action addFirst() {
    log('add:first, expect one each log');

    let newArray = [{ id: this.records.length + 1 }, ...this.records];

    measureTime(
      'add:first',
      () => (this.records = newArray),
      (time) => (this.renderTime = time)
    );
  }

  @action addLast() {
    log('add:last, expect one each log');

    let newArray = [...this.records, { id: this.records.length + 1 }];

    measureTime(
      'add:last',
      () => (this.records = newArray),
      (time) => (this.renderTime = time)
    );
  }

  @action addMiddle() {
    log('add:middle, expect one each log');

    let [first, second, ...rest] = this.records;

    let newArray = [first, second, { id: this.records.length + 1 }, ...rest];

    measureTime(
      'add:middle',
      () => (this.records = newArray),
      (time) => (this.renderTime = time)
    );
  }

  @action removeFirst() {
    log('first removed, expect no each logs');

    let [, ...rest] = this.records;

    measureTime(
      'remove:first',
      () => (this.records = rest),
      (time) => (this.renderTime = time)
    );
  }

  @action removeLast() {
    log('last removed, expect no each logs');

    let copy = [...this.records];

    copy.pop();

    measureTime(
      'remove:last',
      () => (this.records = copy),
      (time) => (this.renderTime = time)
    );
  }

  @action removeMiddle() {
    log('middle removed, expect no each logs');

    let [, middle] = this.records;

    let filtered = this.records.filter((record) => record !== middle);

    measureTime(
      'remove:middle',
      () => (this.records = filtered),
      (time) => (this.renderTime = time)
    );
  }

  @action reset() {
    console.log('|||||||||||||||||||||||||||||||||||||||||');
    console.time('generating new data');

    let fresh = freshArray(this.itemCount);

    console.timeEnd('generating new data');

    log(`this.records has been reset, expect ${fresh.length} logs`);

    measureTime(
      're-setting records',
      () => (this.records = fresh),
      (time) => (this.renderTime = time)
    );
  }

  @action changeItemCount(e: InputEvent) {
    assert(`Expected Input`, e.target instanceof HTMLInputElement);

    let value = e.target.value;

    let num = parseInt(value, 10);

    if (isNaN(num)) {
      this.itemCount = DEFAULT_ITEM_COUNT;

      return;
    }

    this.itemCount = num;
  }
}

async function measureTime(
  label: string,
  callback: () => Promise<unknown> | unknown,
  onDone: (time: number) => void
) {
  let before = performance.now();

  await callback();

  requestAnimationFrame(() => {
    let time = performance.now() - before;

    console.log(`  >> ${label} took ${time}ms -- (until requestAnimationFrame ran)`);
    onDone(time);
  });
}
