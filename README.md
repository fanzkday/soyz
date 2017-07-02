
## 他可以帮我们做什么：
> 分析引用关系: 可以很直观的看到有哪些文件引用了module A, A又引用了谁,有那些文件的引用关系混乱等等。

> 在建立file A和file B之间的引用关系，只需轻轻拖动鼠标即可完成，不再需要手动输入“import * as React from 'react'”;

> 找到需要修改的文件，只需双击就可以实现编辑，不需要再翻目录去找。

> 可视化的界面，丰富的色彩搭配，不容易疲劳，还可以提高开发效率，和工作的积极性。

## 项目才刚刚开始, 也算是我个人的一个探索

## 可以安装试玩一下

![先睹为快，点我](https://github.com/fanzkday/soyz/tree/test/images/desc.png)
## 安装(需要全局)
````
npm install -g soyz
````
## 来个demo一试身手
````
soyz demo
````
## 正式开始
````
soyz init
/* 根据项目需求修改项目目录/.soyz/congif.json文件 */
soyz start
````

## 操作技巧
> 鼠标滚轮           上下滚动

> shift+鼠标滚轮     左右滚动

> 双击小模块可以编辑当前文件（需要在配置文件中指定编辑器的可执行文件的地址,例如）

````
C:\Program Files\sublime\sublime.exe
````

> 每个小模块的输出端可以牵引出一条连接线到另一个小模块的输入端(你的文件内容也会发生变化)

## config.json文件说明
> standard          //项目使用的语言规范(目前仅支持ES6标准，下个版本会支持CommonJs)

> autoSaveInterval  //自动保存的时间间隔

> ignoreDirs        //忽略的文件夹名字

> extname           //项目使用的文件后缀名，可以是js，ts等等

> idel              //默认编辑器的可执行文件的地址(默认为code，即微软的vs code)

## 希望
> 真心邀请有想法的小伙伴一起来实现更多的功能。

> 欢迎issue，欢迎star。
