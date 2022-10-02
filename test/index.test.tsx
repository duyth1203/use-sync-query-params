import { act, renderHook } from '@testing-library/react';

import useSyncQueryParams from '../src';

describe('Test custom hook `useSyncQueryParams`', () => {
  beforeEach(() => {
    // Reset query params to empty
    const path = window.location.origin + window.location.pathname;
    window.history.pushState({ path }, '', path);
  });

  it('should not show any query param on mount with no default params', () => {
    const { result } = renderHook(() => useSyncQueryParams({}));

    expect(window.location.search).toBe('');
    expect(result.current.getAllParams()).toMatchObject({});
  });

  it('should properly sync query param on mount', () => {
    const { result } = renderHook(() => useSyncQueryParams({ foo: 'bar' }));

    expect(window.location.search).toBe('?foo=bar');
    expect(result.current.getParam('foo')).toBe('bar');
  });

  it('should parse query properly', () => {
    let setterResult: boolean = false;
    const path = window.location.origin + window.location.pathname + '?foo=baz';
    window.history.pushState({ path }, '', path);
    const { result } = renderHook(() => useSyncQueryParams({ foo: 'bar' }));

    expect(window.location.search).toBe('?foo=baz');

    act(() => {
      setterResult = result.current.setParam('foo', 'baz2');
    });

    expect(setterResult).toBeTruthy();
    expect(window.location.search).toBe('?foo=baz2');
    expect(result.current.getParam('foo')).toBe('baz2');
  });

  it('should parse query empty `string` properly', () => {
    const { result } = renderHook(() => useSyncQueryParams({ foo: 'bar' }));

    act(() => {
      result.current.setParam('foo', '');
    });

    expect(window.location.search).toBe('');
    expect(result.current.getParam('foo')).toBeUndefined();
  });

  it('should parse query `null` properly', () => {
    const { result } = renderHook(() => useSyncQueryParams({ foo: 'bar' }));

    act(() => {
      result.current.setParam('foo', null);
    });

    expect(window.location.search).toBe('');
    expect(result.current.getParam('foo')).toBeUndefined();
  });

  it('should parse query `undefined` properly', () => {
    const { result } = renderHook(() => useSyncQueryParams({ foo: 'bar' }));

    act(() => {
      result.current.setParam('foo', undefined);
    });

    expect(window.location.search).toBe('');
    expect(result.current.getParam('foo')).toBeUndefined();
  });

  it('should clear query param properly', () => {
    const { result } = renderHook(() => useSyncQueryParams({ foo: 'bar' }));

    act(() => {
      result.current.clearParam('foo');
    });

    expect(window.location.search).toBe('');
    expect(result.current.getParam('foo')).toBeUndefined();
  });

  it('should not sync default param with empty value to URL query params', () => {
    const { result } = renderHook(() =>
      useSyncQueryParams({ foo: undefined, foo2: 'bar' })
    );

    expect(window.location.search).toBe('?foo2=bar');
    expect(result.current.getParam('foo2')).toBe('bar');
    expect(result.current.getParam('foo')).toBeUndefined();
  });

  it('should not re-render if new value to set is empty as current state', () => {
    let count = 0;
    const { result } = renderHook(() => {
      count++;
      return useSyncQueryParams({ foo: undefined });
    });

    act(() => {
      result.current.setParam('foo', null);
    });

    expect(count).toBe(1);
  });

  it('should not re-render if new value to set is the same as current state', () => {
    let count = 0;
    const { result } = renderHook(() => {
      count++;
      return useSyncQueryParams({ foo: 'bar' });
    });

    act(() => {
      result.current.setParam('foo', 'bar');
    });

    expect(count).toBe(1);
  });

  it('should not sync both hook states and URL query params when `window.history.pushState` is not available', () => {
    let setterResult: boolean = true;
    // @ts-ignore
    window.history.pushState = undefined;
    const { result } = renderHook(() => useSyncQueryParams({ foo: undefined }));

    act(() => {
      setterResult = result.current.setParam('foo', 'baz');
    });

    expect(setterResult).toBeFalsy();
    expect(window.location.search).toBe('');
    expect(result.current.getParam('foo')).toBeUndefined();
  });
});
