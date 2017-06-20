import React from 'react';
import * as $ from 'jquery';
import { Modal, Form, Input, Select, Icon } from 'antd';
import socket from '../../util/socket.js';

export class Content extends React.Component {
    state = { isVisible: false, dir: [] };
    structure = {};
    render() {
        socket.on('get-module', modulesName => {
            $('#content .module .only_output').remove();
            modulesName.forEach(name => {
                $('#content .module').append(onlyOutpurBattery(name));
            })
        })
        return (
            <div id="content" onMouseDown={this.click.bind(this)}>
                <div className="module">
                    <div className="reload">
                        <Icon type="reload" style={{ fontSize: 18, color: '#999' }} onClick={() => {socket.emit('get-module', null);}}/>
                    </div>
                </div>
                <Modal
                    title="新建文件"
                    visible={this.state.isVisible}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.onCancel.bind(this)}
                >
                    <Form>
                        <Form.Item label="选择所属文件夹" hasFeedback>
                            <Select placeholder="请选择" onChange={this.onChange.bind(this)}>
                                {
                                    this.state.dir.map((item, index) => {
                                        return (
                                            <Select.Option value={item} key={index}>{item}</Select.Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="多个文件名用空格分割" hasFeedback>
                            <Input placeholder="index.js" title="filename" onBlur={this.onBlur.bind(this)} />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
    click(e) {
        const structure = JSON.parse(sessionStorage.getItem('structure'));
        console.log(structure);
        if (structure && structure.directory && e.button === 2) {
            const dir = structure.directory.replace(/^\s*/, '').replace(/\s*&/, '').split(' ');
            this.setState({ isVisible: !this.state.isVisible, dir: dir });
        }
    }
    onChange(value) {
        this.structure.dirname = value;
    }
    onBlur(e) {
        this.structure.filename = e.target.value;
    }
    onCancel() {
        this.setState({ isVisible: !this.state.isVisible });
    }
    handleOk() {
        if (this.structure.dirname && this.structure.filename) {
            this.setState({ isVisible: !this.state.isVisible });
            socket.emit('make-file', this.structure);
            var filenames = this.structure.filename.split(' ');
            filenames.forEach(name => {
                const texts = $('.battery').text();
                var text = this.structure.dirname + ' > ' + name;
                if (texts.indexOf(text) === -1) {
                    $(battery(text)).appendTo($('#content'));
                }
            })
        }
    }
}

function battery(text) {
    return (
        `<div class="battery">
            <p class="title">${text}</p>
            <span class="input"></span>
            <span class="output"></span>
        </div>`
    )
}

function onlyOutpurBattery(text) {
    return (
        `<div class="battery only_output">
            <p class="title" title="${text}">${text}</p>
            <span class="output"></span>
        </div>`
    )
}