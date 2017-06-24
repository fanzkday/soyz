import React from 'react';
import ReactDOM from 'react-dom';
import { Main } from './components';
import './components/drag';
import 'antd/dist/antd.css';
import './style/style.css';

ReactDOM.render(<Main />, document.getElementById('root'));

window.oncontextmenu = () => false;
