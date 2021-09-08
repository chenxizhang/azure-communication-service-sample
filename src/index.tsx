import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    {
      (process.env.REACT_APP_connectionString && process.env.REACT_APP_endpointUrl) ? <App /> : <h1>请先进行配置，创建一个.env.local文件在根目录，定义两个变量 REACT_APP_endpointUrl 和 REACT_APP_connectionString</h1>
    }
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
