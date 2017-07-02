import React from 'react';
import * as $ from 'jquery';
import { Button, Modal, Form, Input, Radio, Icon } from 'antd';

export class Setting extends React.Component {
    state = { isVisible: false };
    render() {
        return (
            <div id="setting">
                <a href="https://github.com/fanzkday/soyz" id="github">
                    <Icon type="github" style={{fontSize: 15}}/>
                </a>
                <Button icon="setting" onClick={this.click.bind(this)}></Button>
                <Modal
                    title="设置"
                    visible={this.state.isVisible}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.click.bind(this)}
                >
                    <Form>
                        <Form.Item label="连接线文字显示" hasFeedback>
                            <Radio.Group onChange={this.isPathText} defaultValue={0}>
                                <Radio value={0}>关</Radio>
                                <Radio value={1}>开</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="文件路径显示" hasFeedback>
                            <Radio.Group onChange={this.isDirPath} defaultValue={1}>
                                <Radio value={0}>关</Radio>
                                <Radio value={1}>开</Radio>
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
            $('text').fadeOut();
        } else {
            $('text').fadeIn();
        }
    }
    isDirPath(e) {
        const num = e.target.value;
        if (num === 0) {
            $('.battery').children('div').fadeOut();
        } else {
            $('.battery').children('div').fadeIn();
        }
    }
    click() {
        this.setState({ isVisible: !this.state.isVisible });
    }
    handleOk() {
        this.setState({ isVisible: !this.state.isVisible });
    }
    onChange(e) {
        
    }
}
