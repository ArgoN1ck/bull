export const isParent = <T, P extends new (...args: never[]) => object>(
  target: T,
  parent: P
): target is InstanceType<P> & T => {
  let current = Object.getPrototypeOf(target);

  while (current !== null) {
    if (current === parent.prototype) {
      return true;
    }
    current = Object.getPrototypeOf(current);
  }

  return false;
};
