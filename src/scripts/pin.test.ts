import { describe, it, expect } from 'vitest';
import { overflowOf, pinAmount } from './pin';

describe('overflowOf', () => {
  it('is zero when the content fits', () => {
    expect(overflowOf(600, 800)).toBe(0);
  });
  it('is the excess when the content is taller', () => {
    expect(overflowOf(1400, 800)).toBe(600);
  });
  it('accounts for a viewport shortened by the masthead strip', () => {
    expect(overflowOf(1000, 800 - 46)).toBe(246);
  });
});

describe('pinAmount', () => {
  it('is zero before the spacer enters the viewport', () => {
    expect(pinAmount(900, 800, 600)).toBe(0);
  });
  it('tracks scroll once the spacer is entering', () => {
    expect(pinAmount(500, 800, 600)).toBe(300);
  });
  it('clamps at the overflow so content never overshoots', () => {
    expect(pinAmount(-400, 800, 600)).toBe(600);
  });
  it('is zero when there is no overflow', () => {
    expect(pinAmount(0, 800, 0)).toBe(0);
  });
});
