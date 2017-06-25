import React from 'react';
import { Setting } from './settings';
import { Content } from './content';

export class Main extends React.Component {
    render() {
        return (
            <div>
                <div id="svg">
                    <svg width="100%" height="100%"></svg>
                </div>
                <Content></Content>
                <Setting></Setting>
            </div>
        )
    }
}