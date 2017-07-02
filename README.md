
## 他可以帮我们做什么：
> 针对目前模块化开发，分析模块之间引用关系，并以图形的方式展现

> 可以在页面上通过拖动的方式修改模块的引用关系

> 如果你中途加入一个新项目，通过soyz你可以更快的熟悉项目结构和架构



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
> standard          //项目使用的语言规范(目前仅支持ES6和CommonJs)

> autoSaveInterval  //自动保存的时间间隔

> ignoreDirs        //忽略的文件夹名字

> extname           //项目使用的文件后缀名，可以是js，ts等等

> idel              //默认编辑器的可执行文件的地址(默认vs code)


### 这个项目才刚开始, 也算是我个人的一个探索
### 有兴趣的朋友可以加群一起交流后续功能开发：368993727
