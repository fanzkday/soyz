import React from 'react';
import * as $ from 'jquery';
import { Modal, Form, Input, Select, Icon } from 'antd';

import { battery, onlyOutputBattery } from '../bat';
import socket from '../../util/socket.js';
import { addToList } from '../../util/storage.js';

export class Content extends React.Component {
    // constructor() {
    //     super();
    //     socket.on('get-module', modulesNames => {
    //         modulesNames.forEach(name => {
    //             // 先把新建的文件保存，在返回值值中含有，id,dir,name;
    //             const info = addToList('', name);
    //             if ($(`#${info.id}`).length === 0) {
    //                 $('#content .module').append(onlyOutputBattery(info));
    //             }
    //         })
    //     })
    // }
    state = { isVisible: false, dir: [] };
    dir = '';
    filenames = [];
    componentDidMount() {
        var data = JSON.parse(sessionStorage.getItem('relations'));
        if (data) {
            const dev = data.devDependencies;
            //渲染module
            for (var key in dev) {
                const info = {
                    id: dev[key].id,
                    dir: '',
                    name: dev[key].name
                }
                addToList(dev[key].id, dev[key].dir, key);
                if ($(`#${info.id}`).length === 0) {
                    $('#content .module').append(onlyOutputBattery(info));
                }
            }
            const relations = data.app;
            reObject(data.app);
            function reObject(obj) {
                for (var key in obj) {
                    if (typeof obj[key] === 'object' && !obj[key].id) {
                        reObject(obj[key]);
                    }
                    if (typeof obj[key] === 'object' && obj[key].id) {
                        const info = {
                            id: obj[key].id,
                            dir: obj[key].dir,
                            name: key
                        }
                        console.log(info);
                        var result = addToList(obj[key].id, obj[key].dir, key);
                        console.log(result);
                        if ($(`#${info.id}`).length === 0) {
                            $(battery(info)).css({top: obj[key].pos.y, left: obj[key].pos.x}).appendTo($('#content'));
                        }
                    }
                }
            }
        }
    }
    render() {
        return (
            <div id="content">
                <div className="module">
                    <div className="reload">
                        <div onClick={this.click.bind(this)}>hello</div>
                        <Icon type="reload"
                            style={{ fontSize: 18, color: '#999' }}
                            onClick={() => socket.emit('get-module', null)}
                        />
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
                            <Input defaultValue="index.js pre.js" title="filename" onBlur={this.onBlur.bind(this)} />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
    click(e) {
        const dir = JSON.parse(sessionStorage.getItem('dir'));
        if (dir) {
            this.setState({ isVisible: !this.state.isVisible, dir: dir });
        }
    }
    onChange(value) {
        this.dir = value;
    }
    onBlur(e) {
        this.filenames = e.target.value.replace(/^\s*/, '').replace(/\s*$/, '').split(' ');
    }
    onCancel() {
        this.setState({ isVisible: false });
    }
    handleOk() {
        if (this.dir && this.filenames) {
            this.setState({ isVisible: false });

            socket.emit('make-file', { dir: this.dir, filename: this.filenames });
            this.filenames.forEach(name => {
                // 先把新建的文件保存，在返回值值中含有，id,dir,name;
                const info = addToList(this.dir, name);
                if ($(`#${info.id}`).length === 0) {
                    $(battery(info)).appendTo($('#content'));
                }
            })
        }
    }
}
