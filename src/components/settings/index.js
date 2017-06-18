import React from 'react';
import { Button, Modal, Form, Input, Select } from 'antd';
import socket from '../../util/socket.js';

export class Setting extends React.Component {
    state = { isVisible: false };
    structure = new Proxy({}, {
        set(target, key, value) {
            var value = value.replace(/^\s*/, '').replace(/\s*&/, '');
            if (value.indexOf(';') !== -1) {
                value = value.split(';');
            }
            return target[key] = value;
        }
    })
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
                        <Form.Item label="目录结构(必须)" hasFeedback>
                            <Input placeholder="如: components;container;model;route" name="directory" onBlur={this.onChange.bind(this)} />
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
        if (this.structure.directory && this.structure.entry) {
            this.setState({ isVisible: !this.state.isVisible });
            socket.emit('make-structure', this.structure);
            console.log(this.structure);
            sessionStorage.setItem('structure', JSON.stringify(this.structure));
        }
    }
    onChange(e) {
        this.structure[e.target.name] = e.target.value;
    }
}
