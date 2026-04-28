// __tests__/unit/utils.test.ts
// Business-logic unit test — covers parseDomain, relativeTime, and debounce.
// These are pure functions with no React/RN dependencies, making them fast
// and deterministic to test.

import { debounce, parseDomain, relativeTime } from '../../src/utils';

describe('parseDomain', () => {
  it('returns hostname without www prefix', () => {
    expect(parseDomain('https://www.example.com/path?q=1')).toBe('example.com');
  });

  it('returns hostname for URLs without www', () => {
    expect(parseDomain('https://news.ycombinator.com/item?id=123')).toBe('news.ycombinator.com');
  });

  it('returns the original string for invalid URLs', () => {
    expect(parseDomain('not-a-url')).toBe('not-a-url');
  });

  it('handles URLs with subdomain but not www', () => {
    expect(parseDomain('https://blog.github.com/post')).toBe('blog.github.com');
  });
});

describe('relativeTime', () => {
  const now = Math.floor(Date.now() / 1000);

  it('returns seconds ago for timestamps under 60s', () => {
    expect(relativeTime(now - 30)).toBe('30s ago');
  });

  it('returns minutes ago for timestamps 1-59m old', () => {
    expect(relativeTime(now - 300)).toBe('5m ago');
  });

  it('returns hours ago for timestamps 1-23h old', () => {
    expect(relativeTime(now - 7200)).toBe('2h ago');
  });

  it('returns days ago for timestamps 1-6d old', () => {
    expect(relativeTime(now - 86400 * 3)).toBe('3d ago');
  });

  it('returns weeks ago for timestamps 7d+ old', () => {
    expect(relativeTime(now - 86400 * 14)).toBe('2w ago');
  });
});

describe('debounce', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('does not call the function before the delay', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 300);
    debounced();
    expect(fn).not.toHaveBeenCalled();
  });

  it('calls the function after the delay', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 300);
    debounced();
    jest.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('resets the timer on repeated calls', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 300);
    debounced();
    jest.advanceTimersByTime(200);
    debounced();
    jest.advanceTimersByTime(200);
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
