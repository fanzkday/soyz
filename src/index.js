import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { Main } from './components';
import 'antd/dist/antd.css';
import './style/style.css';

ReactDOM.render(<Main />, document.getElementById('root'));
registerServiceWorker();
