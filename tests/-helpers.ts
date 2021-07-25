import { tracked } from '@glimmer/tracking';

export class Wrapper {
  constructor(public record: unknown) {}
}

export interface TestRecord {
  id: number;
  someProp?: string;
}

class ExampleTrackedThing {
  @tracked declare id: number;
  @tracked someValue = '';

  constructor(id: number) {
    this.id = id;
  }
}

export function testData(id: number) {
  return new ExampleTrackedThing(id);
}
