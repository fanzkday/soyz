import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import 'jquery';
import { Main } from './components';
import './components/drag';
import 'antd/dist/antd.css';
import './style/style.css';

ReactDOM.render(<Main />, document.getElementById('root'));
registerServiceWorker();
window.oncontextmenu = () => false;