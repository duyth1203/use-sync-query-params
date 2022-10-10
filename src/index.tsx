import { useMemo, useCallback, useState, useEffect } from 'react';
import 'url-search-params-polyfill';

type TKey = string;
type TValue = string | number | boolean | null | undefined;
type TRecord = Record<TKey, TValue>;

function isEmpty(value: any) {
  return value === '' || value === null || value === undefined;
}

function stringifyParams(params: TRecord) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (!isEmpty(value)) {
      searchParams.set(key, String(value));
    }
  });
  return searchParams.toString();
}

function updateURLQueryParam(params: TRecord) {
  const stringifiedParams = stringifyParams(params);
  const newUrl =
    window.location.origin + window.location.pathname + '?' + stringifiedParams;
  window.history.pushState({ path: newUrl }, '', newUrl);
}

function isPushStateAvailable() {
  return !!window.history.pushState;
}

/**
 * Initial the hook with default params. Automatic URL query params synchronization will happen only once on mount.
 * > Changing the default params will not re-trigger the synchronization.
 */
export default function useSyncQueryParams<TParams extends TRecord>(
  defaultParams: TParams
) {
  // Initialize hook states and automatically update URL query params
  const parseSearchParams = useMemo(() => {
    if (!isPushStateAvailable()) return {} as TParams;
    const searchParams = new URLSearchParams(window.location.search);

    return Object.keys(defaultParams).reduce((acc, key) => {
      const searchParamValue = searchParams.get(key);

      if (!isEmpty(searchParamValue)) {
        return {
          ...acc,
          [key]: String(searchParamValue),
        };
      }

      if (isEmpty(defaultParams[key])) return acc;

      // fallback to default value
      return {
        ...acc,
        [key]: String(defaultParams[key]),
      };
    }, {} as TParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [_params, _setParams] = useState<TParams>(parseSearchParams);

  useEffect(() => {
    if (!!window.history.pushState) updateURLQueryParam(parseSearchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Action handlers
  /**
   * Get specific key from query params. Autosuggestion mapped to keys of the default params.
   */
  const getParam = useCallback(
    (key: keyof TParams) => {
      return _params[key];
    },
    [_params]
  );

  // Get a set of params.
  const getParams = useCallback(
    (...keys: Array<keyof TParams>) => {
      const params: Array<string> = [];
      keys.forEach(key => {
        params.push(String(_params[key]));
      });
      return params;
    },
    [_params]
  );

  /**
   * Get all query params. The result contains all records with keys of the default params except those that were cleared.
   */
  const getAllParams = () => _params;

  /**
   * Set a specific key with a value. Empty values (empty string, null, undefined) will be cleared.
   */
  const setParam = useCallback(
    (key: keyof TParams, value: TValue) => {
      if (!isPushStateAvailable()) return false;
      if (getParam(key) === String(value)) return true;
      if (isEmpty(getParam(key)) && isEmpty(value)) return true;

      _setParams(prevParams => {
        const { [key]: _, ...prevParamsWithoutKey } = prevParams;
        const updatedParams = isEmpty(value)
          ? // Omit the key if the value is empty
            (prevParamsWithoutKey as TParams)
          : {
              ...prevParams,
              [key]: value,
            };
        updateURLQueryParam(updatedParams);
        return updatedParams;
      });
      return true;
    },
    [getParam]
  );

  /**
   * Set a set of records. Empty values (empty string, null, undefined) will be cleared.
   */
  const setParams = useCallback(
    (newParams: Record<keyof TParams, TValue>) => {
      if (!isPushStateAvailable()) return false;

      _setParams(prevParams => {
        const parsedNewParams = Object.entries({
          ...prevParams,
          ...newParams,
        }).reduce((acc, [key, value]) => {
          if (isEmpty(value) || acc[key] === String(value)) return acc;
          return {
            ...acc,
            [key]: value,
          };
        }, {} as TParams);
        updateURLQueryParam(parsedNewParams);
        return parsedNewParams;
      });

      return true;
    },
    [getParam]
  );

  /**
   * Clear specific key from query params. Same as `setParam` with empty value.
   */
  const clearParam = useCallback((key: keyof TParams) => setParam(key, null), [
    setParam,
  ]);

  /**
   * Clear a set of keys from query params. Same as `setParams` with empty values.
   */
  const clearParams = useCallback(
    (...keys: Array<keyof TParams>) => {
      return setParams(
        keys.reduce(
          (acc, key) => ({ ...acc, [key]: null }),
          {} as Parameters<typeof setParams>[0]
        )
      );
    },
    [setParams]
  );

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
