// src/components/AnalyticsBarGraph/utils/memoization.utils.ts

/**
 * Performs a fast shallow equality check on objects.
 * Critical for React.memo to prevent unnecessary Zone re-renders.
 */
export const shallowEqual = <T extends Record<string, unknown>>(
  objA: T,
  objB: T
): boolean => {
  if (Object.is(objA, objB)) return true;

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (!Object.prototype.hasOwnProperty.call(objB, key) || objA[key] !== objB[key]) {
      return false;
    }
  }

  return true;
};

/**
 * Checks equality of two Sets.
 * Required for O(1) multi-selection state comparisons in the SelectionEngine context.
 */
export const areSetsEqual = <T>(setA: Set<T>, setB: Set<T>): boolean => {
  if (setA.size !== setB.size) return false;
  for (const item of setA) {
    if (!setB.has(item)) return false;
  }
  return true;
};

/**
 * Caches the result of a pure function based on its latest arguments.
 * Prevents recalculation of scale and ticks unless dataset maximums change.
 */
export function memoizeOne<Args extends unknown[], Result>(
  fn: (...args: Args) => Result
): (...args: Args) => Result {
  let lastArgs: Args | null = null;
  let lastResult: Result | null = null;

  return (...args: Args): Result => {
    if (
      lastArgs !== null &&
      lastArgs.length === args.length &&
      lastArgs.every((arg, index) => arg === args[index])
    ) {
      return lastResult as Result;
    }

    lastResult = fn(...args);
    lastArgs = args;
    
    return lastResult;
  };
}