import React from 'react';
import * as $ from 'jquery';
import { Button, Modal, Form, Input, Select } from 'antd';

import { battery } from '../bat';
import socket from '../../util/socket.js';
import { saveIn, addToList } from '../../util/storage.js';

export class Setting extends React.Component {
    state = { isVisible: false };
    dir = [];
    entry = '';
    render() {
        return (
            <div id="setting">
                <Button onClick={this.click.bind(this)}>设置</Button>
                <Modal
                    title="项目设置"
                    visible={this.state.isVisible}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.click.bind(this)}
                >
                    <Form>
                        <Form.Item label="目录结构(必须)：多个名称用空格分隔" hasFeedback>
                            <Input defaultValue="controller model" name="dir" onBlur={this.onChange.bind(this)} />
                        </Form.Item>
                        <Form.Item label="主入口文件(必须)" hasFeedback>
                            <Input placeholder="index.js" name="entry" onBlur={this.onChange.bind(this)} />
                        </Form.Item>
                        <Form.Item label="其他设置" hasFeedback>
                            <Select defaultValue="lucy">
                                <Select.Option value="jack">Jack</Select.Option>
                                <Select.Option value="lucy">Lucy</Select.Option>
                                <Select.Option value="disabled">Disabled</Select.Option>
                                <Select.Option value="Yiminghe">yiminghe</Select.Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
    click() {
        this.setState({ isVisible: !this.state.isVisible });
    }
    handleOk() {
        if (this.dir && this.entry) {
            this.setState({ isVisible: false });

            socket.emit('make-dir', { dir: this.dir, entry: this.entry });
            saveIn('dir', this.dir);
            const info = addToList('entry', this.entry);
            if (info) {
                $(battery(info)).appendTo($('#content'));
            }
        }
    }
    onChange(e) {
        const value = e.target.value.replace(/^\s*/, '').replace(/\s*$/, '');
        if (!value) return;
        if (e.target.name === 'dir') {
            this.dir = value.split(' ');
        } else if (e.target.name === 'entry') {
            this.entry = value;
        }
    }
}
