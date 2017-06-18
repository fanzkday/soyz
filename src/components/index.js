import React from 'react';
import { Setting } from './settings';
import { Content } from './content';
import { Svg } from './svg';

export class Main extends React.Component {
    render() {
        return (
            <div>
                <Svg></Svg>
                <Content></Content>
                <Setting></Setting>
            </div>
        )
    }
}