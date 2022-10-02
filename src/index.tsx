import { useMemo, useCallback, useState, useEffect } from 'react';

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

export default function useSyncQueryParams<TParams extends TRecord>(
  defaultParams: TParams
) {
  const parseSearchParams = useMemo(() => {
    const searchParams = new URLSearchParams(window.location.search);
    return Object.keys(defaultParams).reduce((acc, key) => {
      const searchParamsValue = searchParams.get(key);
      let val: TValue = searchParamsValue;
      if (isEmpty(val)) return acc;
      return {
        ...acc,
        [key]: String(val),
      };
    }, defaultParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [params, setParams] = useState(parseSearchParams);

  useEffect(() => {
    updateURLQueryParam(parseSearchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getParam = useCallback(
    (key: keyof TParams) => {
      return params[key];
    },
    [params]
  );

  const getAllParams = useCallback(() => params, [params]);

  const setParam = useCallback((key: keyof TParams, value: TValue) => {
    setParams(prevParams => {
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
  }, []);

  return { getParam, getAllParams, setParam };
}
