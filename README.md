# use-sync-query-params

> Sync React props/states to URL query params. Zero dependency.

## Purposes

- Initialize the URL query params with a default ones.
  - The default params can come from any source: `redux`, `props`, computed variables...
- Update query params on demand

## Usage examples

```TSX
import useSyncQueryParams from 'use-sync-query-params'

export default function App(props) {
  const params = useSyncQueryParams({ foo: 'bar' })
  // Or
  const params = useSyncQueryParams({ foo: props.foo })
  // Or
  const foo = new URLSearchParams(window.location.search).get('foo')
  const params = useSyncQueryParams({ foo })

  return (
    <>
      <p>{params.getParam('foo')}</p>
      <p>{window.location.search}</p>
      <pre>{JSON.stringify(params.getAllParams())}</pre>
      <br/>
      <button onClick={() => params.setParam('foo', 'baz')}>Change bar to baz</button>
      <br/>
      <button onClick={() => params.setParam('foo', null)}>Clear query param<button>
    </>
  )
}
```

## APIs

1. `useSyncQueryParams(defaultParams: { [x: string]: string | number | boolean | null | undefined }) => ({ getParam, getAllParams, setParam })`

   Initial the hook with default params. Automatic URL query params synchronization will happen only once on mount.

   Changing the default params will not re-trigger the synchronization.

2. `getParam: (key: string) => string`

   Get specific key from query params. Autosuggestion mapped to keys of the default params.

3. `getAllParams: () => Object`

   Get all query params. The result contains all records with keys of the default params except those that were cleared.

4. `setParam: (key: string, value: string | number | boolean | null | undefined) => void`

   Set a specific key with a value. Empty values (empty string, null, undefined) will be cleared.
