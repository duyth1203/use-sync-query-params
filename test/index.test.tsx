import { act, renderHook } from '@testing-library/react';

import useSyncQueryParams from '../src';

describe('Test custom hook `useSyncQueryParams`', () => {
  it('should not show any query param on mount with no default params', () => {
    const { result } = renderHook(() => useSyncQueryParams({}));
    expect(window.location.search).toBe('');
    expect(result.current.getAllParams()).toMatchObject({});
  });

  it('should properly set query param', () => {
    const { result } = renderHook(() => useSyncQueryParams({ foo: 'bar' }));

    expect(window.location.search).toBe('?foo=bar');
    expect(result.current.getParam('foo')).toBe('bar');
  });

  it('should parse query `string` properly', () => {
    const { result } = renderHook(() => useSyncQueryParams({ foo: 'bar' }));

    act(() => {
      result.current.setParam('foo', 'baz');
    });

    expect(window.location.search).toBe('?foo=baz');
    expect(result.current.getParam('foo')).toBe('baz');
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
});
