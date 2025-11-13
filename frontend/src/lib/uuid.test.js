import { describe, it, expect } from 'vitest';
import { uuidv4 } from './uuid';

describe('uuidv4', () => {
  it('should generate a string', () => {
    const id = uuidv4();
    expect(typeof id).toBe('string');
  });

  it('should have the correct format', () => {
    const id = uuidv4();
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(id).toMatch(regex);
  });

  it('should generate unique ids', () => {
    const id1 = uuidv4();
    const id2 = uuidv4();
    expect(id1).not.toBe(id2);
  });
});
