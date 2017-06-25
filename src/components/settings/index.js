import React from 'react';
import * as $ from 'jquery';
import { Button, Modal, Form, Input, Radio } from 'antd';

export class Setting extends React.Component {
    state = { isVisible: false };
    render() {
        return (
            <div id="setting">
                <Button onClick={this.click.bind(this)}>设置</Button>
                <Modal
                    title="设置"
                    visible={this.state.isVisible}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.click.bind(this)}
                >
                    <Form>
                        <Form.Item label="语言规范" hasFeedback>
                            <Radio.Group onChange={this.isPathText}>
                                <Radio value={0}>CommonJS</Radio>
                                <Radio value={1}>ES6</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="自动保存时间(min)" hasFeedback>
                            <Radio.Group onChange={this.isPathText}>
                                <Radio value={5}>5</Radio>
                                <Radio value={10}>10</Radio>
                                <Radio value={15}>15</Radio>
                                <Radio value={20}>20</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="需要忽略的文件夹(空格分开)" hasFeedback>
                            <Input placeholder="node_modules build" />
                        </Form.Item>
                        <Form.Item label="需要忽略的文件类型(空格分开)" hasFeedback>
                            <Input placeholder="less scss md" />
                        </Form.Item>
                        <Form.Item label="连接线文字显示" hasFeedback>
                            <Radio.Group onChange={this.isPathText}>
                                <Radio value={0}>开</Radio>
                                <Radio value={1}>关</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
    isPathText(e) {
        const num = e.target.value;
        if (num === 0) {
            $('text').show();
        } else {
            $('text').hide();
        }
    }
    click() {
        this.setState({ isVisible: !this.state.isVisible });
    }
    handleOk() {
        
    }
    onChange(e) {
        
    }
}
