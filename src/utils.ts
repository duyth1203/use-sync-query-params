import { TRecord } from './types';

export function isEmpty(value: any) {
  return value === '' || value === null || value === undefined;
}

export function stringifyParams(params: TRecord) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (!isEmpty(value)) searchParams.set(key, String(value));
  });
  return searchParams.toString();
}

export function updateURLQueryParam(params: TRecord) {
  const stringifiedParams = stringifyParams(params);
  const newUrl =
    window.location.origin + window.location.pathname + '?' + stringifiedParams;
  window.history.pushState({ path: newUrl }, '', newUrl);
}

export function isPushStateAvailable(): boolean {
  return typeof window.history.pushState === 'function';
}
