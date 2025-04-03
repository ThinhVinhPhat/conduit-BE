import { Calculation } from './calculation';

describe('Caculation', () => {
  describe('checkNumber', () => {
    it(' Both arguments must be numbers', () => {
      expect(Calculation['checkNumbers'](0, 'a')).toThrow(
        'Both numbers must be defined',
      );
      expect(Calculation['checkNumbers']('b', 0)).toThrow(
        'Both numbers must be defined',
      );
      expect(Calculation['checkNumbers']('b', 'a')).toThrow(
        'Both numbers must be defined',
      );
    });
    it('two numbers shoold not be undefined', () => {
      expect(Calculation['checkNumbers'](0, undefined)).toThrow(
        ' Both numbers must be defined',
      );
      expect(Calculation['checkNumbers'](undefined, 0)).toThrow(
        ' Both numbers must be defined',
      );
      expect(Calculation['checkNumbers'](undefined, undefined)).toThrow(
        ' Both numbers must be defined',
      );
    });
  });
  describe('sum', () => {
    it(' should return the sum of two numbers', () => {
      expect(Calculation.sum(0, 1)).toBe(1);
      expect(Calculation.sum(1, 1)).toBe(2);
      expect(Calculation.sum(2, 1)).toBe(3);
      expect(Calculation.sum(4, 1)).toBe(5);
    });
  });
});
