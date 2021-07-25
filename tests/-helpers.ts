import { TrackedObject } from 'tracked-built-ins';

export class Wrapper {
  constructor(public record: unknown) {}
}

export interface TestRecord {
  id: number;
  someProp?: string;
}

export function testData(id: number) {
  return new TrackedObject({ id, someValue: '' });
}
