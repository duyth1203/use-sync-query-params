import { useRef, useMemo, useEffect } from 'react';

import { TKey, TRecord, TValue } from './types';
import { isEmpty, isPushStateAvailable, updateURLQueryParam } from './utils';

/**
 * Initial the hook with default params. Automatic URL query params synchronization will happen only once on mount.
 */
export default function useSyncQueryParams<TParams extends TRecord>(
  defaultParams: TParams
) {
  const results = useRef(new Map<TKey, TValue>()).current;

  // Initialize hook states and automatically update URL query params
  const parseSearchParams = useMemo<TParams>(() => {
    if (!isPushStateAvailable()) return {} as TParams;
    const searchParams = new URLSearchParams(window.location.search);

    Object.keys(defaultParams).forEach(key => {
      const searchParamValue = searchParams.get(key);
      if (!isEmpty(searchParamValue)) {
        results.set(key, String(searchParamValue));
      } else if (!isEmpty(defaultParams[key])) {
        results.set(key, String(defaultParams[key]));
      }
    });

    return Object.fromEntries(results) as TParams;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isPushStateAvailable()) updateURLQueryParam(parseSearchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Action handlers
  /**
   * Get specific key from query params. Autosuggestion mapped to keys of the default params.
   */
  function getParam(key: keyof TParams): TValue {
    return results.get(key);
  }

  // Get a set of params.
  function getParams(...keys: Array<keyof TParams>): Record<TKey, string> {
    return keys.reduce(
      (acc, key) => ({
        ...acc,
        [key]: String(results.get(key)),
      }),
      {} as Record<TKey, string>
    );
  }

  /**
   * Get all query params. The result contains all records with keys of the default params except those that were cleared.
   */
  function getAllParams(): TParams {
    return Object.fromEntries(results) as TParams;
  }

  /**
   * Set a specific key with a value. Empty values (empty string, null, undefined) will be cleared.
   */
  function setParam(key: keyof TParams, value: TValue): boolean {
    if (!isPushStateAvailable()) return false;
    if (isEmpty(value)) results.delete(key);
    else results.set(key, String(value));
    updateURLQueryParam(Object.fromEntries(results));
    return true;
  }

  /**
   * Set a set of records. Empty values (empty string, null, undefined) will be cleared.
   */
  function setParams(newParams: Record<keyof TParams, TValue>): boolean {
    if (!isPushStateAvailable()) return false;
    Object.entries(newParams).forEach(([key, value]) => {
      if (results.has(key) && isEmpty(value)) results.delete(key);
      else results.set(key, String(value));
    });
    updateURLQueryParam(Object.fromEntries(results));
    return true;
  }

  /**
   * Clear specific key from query params. Same as `setParam` with empty value.
   */
  function clearParam(key: keyof TParams): boolean {
    return setParam(key, undefined);
  }

  /**
   * Clear a set of keys from query params. Same as `setParams` with empty values.
   */
  function clearParams(...keys: Array<keyof TParams>): boolean {
    return setParams(
      keys.reduce(
        (acc, key) => ({ ...acc, [key]: null }),
        {} as Parameters<typeof setParams>[0]
      )
    );
  }

  return {
    getParam,
    getParams,
    getAllParams,
    setParam,
    setParams,
    clearParam,
    clearParams,
  };
}
