import './App.css';
import * as React from 'react';
import useSyncQueryParams from 'use-sync-query-params';

function App() {
  const params = useSyncQueryParams({ foo: 'bar' });

  console.log('render');

  return (
    <div className="App">
      <p>{params.getParam('foo')}</p>
      <p>{window.location.search}</p>
      <pre>{JSON.stringify(params.getAllParams())}</pre>
      <br />
      <button onClick={() => params.setParam('foo', 'baz')}>
        Change bar to baz
      </button>
      <br />
      <button onClick={() => params.setParam('foo', 'bar')}>
        Change baz to bar
      </button>
      <br />
      <button onClick={() => params.clearParam('foo')}>
        Clear query param
      </button>
      <br />
      <button onClick={() => params.setParam('foo', null)}>
        Clear query param null
      </button>
      <br />
      <button onClick={() => params.setParam('foo', undefined)}>
        Clear query param undefined
      </button>
      <br />
      <button onClick={() => params.setParam('foo', '')}>
        Clear query param empty string
      </button>
    </div>
  );
}

export default App;
