import React from 'react';
import * as $ from 'jquery';
import { Modal, Form, Input, Select } from 'antd';

import { battery } from '../bat';
import { saveRelationData } from '../../model/relations.js';
import socket from '../../util/socket.js';
import { addToList } from '../../model/batList.js';
import { createModuleBat, createBats, createRelations } from '../../dom/render.js';

export class Content extends React.Component {
    state = { isVisible: false, dir: [] };
    dir = '';
    filenames = [];
    componentDidMount() {
        socket.emit('init', null);
        socket.on('init', data => {
            if (data && typeof data === 'object') {
                try {
                    //把数据保存在model中
                    saveRelationData(data);
                    const posArr = [];
                    //渲染module
                    createModuleBat(data);
                    //渲染Bat和relations
                    createBats(data.relations, posArr);
                    createRelations(data);
                    //将所有的bat的坐标信息上报服务器
                    socket.emit('position', posArr);
                } catch (e) {
                    console.warn(e);
                }
            }
        })
    }
    render() {
        return (
            <div id="content">
                <div className="module">
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
