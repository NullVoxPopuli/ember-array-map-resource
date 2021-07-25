export function freshArray(count = 4) {
  let result = [];

  for (let i = 0; i < count; i++) {
    result.push({ id: i });
  }

  return result;
}

export function log(msg: string) {
  let dashes = '-------';

  // eslint-disable-next-line no-console
  console.log(`${dashes} ${msg} ${dashes}`);
}
