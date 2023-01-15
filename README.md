# Deprecated

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

## Demo

- [CodeSandbox](https://codesandbox.io/p/github/duyth1203/example-use-sync-query-params/main?file=%2FREADME.md&workspace=%257B%2522activeFileId%2522%253A%2522cl90o0pbq000ilsin3tygbii6%2522%252C%2522openFiles%2522%253A%255B%2522%252FREADME.md%2522%255D%252C%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522gitSidebarPanel%2522%253A%2522COMMIT%2522%252C%2522sidekickItems%2522%253A%255B%257B%2522type%2522%253A%2522PREVIEW%2522%252C%2522taskId%2522%253A%2522start%2522%252C%2522port%2522%253A3000%252C%2522key%2522%253A%2522cl90o16pa00852e6cax350y09%2522%252C%2522isMinimized%2522%253Afalse%252C%2522path%2522%253A%2522%252F%253Ffoo%253Dbar%2522%257D%252C%257B%2522type%2522%253A%2522TASK_LOG%2522%252C%2522taskId%2522%253A%2522start%2522%252C%2522key%2522%253A%2522cl90o14wd006g2e6ct64k6qab%2522%252C%2522isMinimized%2522%253Afalse%257D%255D%257D)

## APIs

1. `useSyncQueryParams(defaultParams: { [x: string]: string | number | boolean | null | undefined }) => ({ getParam, getAllParams, setParam, setParams, clearParam })`

   Initial the hook with default params. Automatic URL query params synchronization will happen only once on mount.

2. `getParam: (key: string) => string`

   Get specific key from query params. Autosuggestion mapped to keys of the default params.

3. `getParams: (...keys: string[]) => Object<string, string>`

   Get a set of params.

4. `getAllParams: () => Object`

   Get all query params. The result contains all records with keys of the default params except those that were cleared.

5. `setParam: (key: string, value: string | number | boolean | null | undefined) => boolean`

   Set a specific key with a value. Empty values (empty string, null, undefined) will be cleared.

   - Return `true` if successfully set
   - Otherwise `false` if `window.history.pushState` is not available

6. `setParams: (Object<key: string, value: string | number | boolean | null | undefined>) => boolean`

   Set a set of records. Empty values (empty string, null, undefined) will be cleared.

   - Return `true` if successfully set
   - Otherwise `false` if `window.history.pushState` is not available

7. `clearParam: (key: string) => boolean`

   Clear specific key from query params. Same as `setParam` with empty value.

8. `clearParams: (...keys: string[]) => boolean`

   Clear a set of keys from query params. Same as `setParams` with empty values.
