# use-sync-query-params

> Sync React props/states to URL query params.

## Purposes

- Initialize the URL query params with default ones.
  - The default params can come from any source: `redux`, `props`, computed variables...
- Update query params on demand

## Installation

- Using `npm`

```Bash
npm install --save use-sync-query-params
```

- Using `yarn`

```
yarn add use-sync-query-params
```

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
      <button onClick={() => params.clearParam('foo')}>Clear query param</button>
    </>
  )
}
```

## APIs

1. `useSyncQueryParams(defaultParams: { [x: string]: string | number | boolean | null | undefined }) => ({ getParam, getAllParams, setParam, clearParam })`

   Initial the hook with default params. Automatic URL query params synchronization will happen only once on mount.

   Changing the default params will not re-trigger the synchronization.

2. `getParam: (key: string) => string`

   Get specific key from query params. Autosuggestion mapped to keys of the default params.

3. `getAllParams: () => Object`

   Get all query params. The result contains all records with keys of the default params except those that were cleared.

4. `setParam: (key: string, value: string | number | boolean | null | undefined) => boolean`

   Set a specific key with a value. Empty values (empty string, null, undefined) will be cleared.

   - Return `true` if successfully set
   - Otherwise `false` if `window.history.pushState` is not available
   - If new value (stringified) and previous value are the same, return `true`, and will not trigger re-render
     - Same behavior if new value and previous value are both empty

5. `clearParam: (key: string) => void`

   Clear specific key from query params. Same as `setParam` with empty value.
