export function waitCycles(cycles = 1) {
  return new Promise((resolve) => {
    if (cycles > 1) {
      setImmediate(() => waitCycles(cycles - 1).then(resolve));
    } else {
      resolve();
    }
  });
}

export function waitForPromises() {
  return waitCycles(1);
}
