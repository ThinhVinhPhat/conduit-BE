export const sum = (a, b) => {
  if (a === undefined || b === undefined) {
    return 0;
  }
  if (typeof a !== 'number' || typeof b !== 'number') {
    return 0;
  }
  return a + b;
};

export const subtract = (a, b) => {
  if (a === undefined || b === undefined) {
    return undefined;
  }
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Both arguments must be numbers');
  }
  return a - b;
};

export const multiple = (a, b) => {
  if (a === undefined || b === undefined) {
    return undefined;
  }
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Both arguments must be numbers');
  }
  return a * b;
};

export const divide = (a, b) => {
  if (a === undefined || b === undefined) {
    return undefined;
  }
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Both arguments must be numbers');
  }
  return a / b;
};


export class Calculation {
  static sum = (a, b) => {
    this.checkNumbers(a, b);
    return a + b;
  };

  static subtract = (a, b) => {
    this.checkNumbers(a, b);
    return a - b;
  };

  private static checkNumbers = (a, b) => {
    if (a === undefined || b === undefined) {
      throw new Error(' Both numbers must be defined');
    }
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Both arguments must be numbers');
    }
  };
}
