import React, {useEffect, useRef, useState} from 'react';

import './App.css';

import {JSONPath} from 'jsonpath-plus';

import JsonExpressions from './Expressions';
import Sample from './sample.json';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import "ace-builds/src-noconflict/ext-language_tools.js";

// @ts-ignore
ace.config.setModuleUrl(
  "ace/mode/json_worker",
  new URL('ace-builds/src-noconflict/worker-json.js', import.meta.url).toString()
);

function App() {
  const [inputJson, setInputJson] = useState(JSON.stringify(Sample, null, 4));
  const [result, setResult] = useState(JSON.stringify([], null, 4));
  const [resultType, setResultType] = useState<'value' | 'path'>('value');
  const [query, setQuery] = useState('$.phoneNumbers[:1].type');

  const queryInput = useRef<HTMLInputElement>(null);

  function onChangeJson(input: string) {
    setInputJson(input);
  }

  function onInputQuery(event: any) {
    const inputQuery = event.target.value;
    setQuery(inputQuery);
  }

  function onChangeResultType(event: any) {
    const type = event.target.checked ? 'path' : 'value';
    setResultType(type)
  }

  function applyJsonPath(jsonStr: string, jsonPath: string) {
    let json = '';
    try {
      json = JSON.parse(jsonStr.replace(/(\r\n|\n|\r)/gm, ''));
    } catch (error) {
      setResult('JSON Parse Error');
      return;
    }

    const result = JSONPath({
      json,
      path: jsonPath,
      resultType: resultType,
    });

    if (0 < result.length) {
      setResult(JSON.stringify(result, undefined, 2));
    } else {
      setResult('No match');
    }
  }

  useEffect(() => {
    applyJsonPath(inputJson, query);
  });

  useEffect(() => {
    queryInput.current?.focus();
  }, []);

  return (
    <div className="container-fluid">
      <div className="input-group">
        <span
          className="input-group-text"
          id="basic-addon1"
        >
          JSONPath
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Put JSONPath syntax"
          value={query}
          onInput={onInputQuery}
          ref={queryInput}
        />
      </div>

      <div className="row py-2">
        <div className="col-auto">
          <div className="form-check form-switch mt-1">
            <input
              id="path-switch"
              type="checkbox"
              className="form-check-input"
              onChange={onChangeResultType}
            />
            <label
              htmlFor="path-switch"
              className="form-check-label"
            >
              Output paths
            </label>
          </div>
        </div>

        <div className="col-auto">
          <button
            className="btn btn-link btn-sm"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#jsonPathExpressions"
            aria-expanded="false"
            aria-controls="collapseExample"
          >
            Expand JSONPath expressions
          </button>
        </div>
      </div>

      <JsonExpressions />

      <div className="row">
        <div className="col">
          <h2>Inputs</h2>
          <AceEditor
            className="editor"
            mode="json"
            theme="solarized_dark"
            onChange={onChangeJson}
            name="editor"
            width="auto"
            editorProps={{ $blockScrolling: true }}
            value={inputJson}
          />
        </div>

        <div className="col">
          <h2>Evaluation Results</h2>
          <AceEditor
            mode="json"
            theme="solarized_dark"
            name="editor"
            width="auto"
            editorProps={{ $blockScrolling: true }}
            value={result}
            readOnly={true}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
