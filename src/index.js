import React from 'react';
import ReactDOM from 'react-dom';
import { Main } from './components';
import './dom/event.js';
import './dom/group.js';
import 'antd/dist/antd.css';
import './style/style.css';

ReactDOM.render(<Main />, document.getElementById('root'));

window.oncontextmenu = () => false;
