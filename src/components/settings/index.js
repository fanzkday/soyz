import React from 'react';
import { Button, Modal, Input } from 'antd';

export class Setting extends React.Component {
    constructor() {
        super();
        this.state = { isVisible: false };
    }
    data = {};
    render() {
        return (
            <div id="setting">
                <Button onClick={this.click.bind(this)}>设置</Button>
                <Modal
                    title="hello"
                    visible={this.state.isVisible}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                >
                    <Input onChange={this.onChange.bind(this)} name="first"></Input>
                    <Input onChange={this.onChange.bind(this)} name="second"></Input>
                </Modal>
            </div>
        )
    }
    click() {
        this.setState({ isVisible: !this.state.isVisible });
    }
    handleOk() {
        this.setState({ isVisible: !this.state.isVisible });
    }
    handleCancel() {
        this.setState({ isVisible: !this.state.isVisible });
    }
    onChange(e) {
        this.data[e.target.name] = e.target.value;
        console.log(this.data);
    }
}
