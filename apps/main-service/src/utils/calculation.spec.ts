import { sum } from './calculation';

describe('sum', () => {
  it(' should return the sum of two numbers', () => {
    expect(sum(0, 1)).toBe(1);
    expect(sum(1, 1)).toBe(2);
    expect(sum(2, 1)).toBe(3);
    expect(sum(4, 1)).toBe(5);
  });
  it('two numbers shoold not be undifined', () => {
    expect(sum(0, undefined)).toBe(0);
    expect(sum(undefined, 0)).toBe(0);
    expect(sum(undefined, undefined)).toBe(0);
  });
  it('two numbers shoold be type number', () => {
    expect(sum(0, 'a')).toBe(0);
    expect(sum('a', 0)).toBe(0);
  });
});
