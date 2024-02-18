# Chat Nio Javascript Node Library

![NPM Version](https://img.shields.io/npm/v/chatnio-node)![NPM Downloads](https://img.shields.io/npm/dt/chatnio-node?label=total%20downloads)![GitHub last commit (branch)](https://img.shields.io/github/last-commit/peachest/chatnio-api-node/main)![GitHub License](https://img.shields.io/github/license/peachest/chatnio-api-node)

<p align="center">
    Node.js 上的 Chat Nio API 的 JavaScript/TypeScript 分支库。
    <br />
    <br />
    <a href="README.md">English</a>
    ·
    <a href="README_zh.md">简体中文</a>
    <br />
    <br />
    <a href="#快速开始">快速开始</a>
    ·
    <a href="https://github.com/peachest/artistic-readme-cli/issues">报告错误</a>
    ·
    <a href="https://github.com/peachest/artistic-readme-cli/issues">添加新功能</a>
    <br />
    <br />
    <a href="https://chatnio.net">官方 web 应用</a>
    ·
    <a href="https://docs.chatnio.net/">官方文档</a>
    <br />
    <br />
    <a href="https://stats.deeptrain.net/">
        <img src="https://stats.deeptrain.net/repo/peachest/chatnio-api-node/?theme=light" alt="Stat"/>
    </a>
</p>




- Authors: Deeptrain Team
- Free software: MIT license
- Documentation: https://docs.chatnio.net



## 内容目录

* [特性](#特性)
* [依赖](#依赖)
* [安装](#安装)
* [快速开始](#快速开始)
* [用法](#用法)
  * [API](#API)
  * [Example](#Example)

* [构建](#构建)
* [常见问题解答](#常见问题解答)
* [相关资源](#相关资源)



## 特性

查看官方 [文档](#https://docs.chatnio.net) 网站：

- 聊天 Chat
- 对话 Conversation
- 配额 Quota
- 订阅和礼包 Subscription and Package



## 依赖

- [axios](https://github.com/axios/axios#browser-support) （用于 http 请求）
- [websockets](https://github.com/websockets/ws)（使用流实现聊天）

<p align="right">[<a href="#内容目录">↑ 回到顶部</a>]</p>

## 安装

```shell
npm install chatnio-node
# 或者使用 yarn, pnpm
yarn add chatnio-node
```



## 快速开始

* 注册并登录官方 [Chatnio](https://chatnio.net) 网站
* 点击右上角的用户头像
* 选择 `API 设置` 菜单项
* 复制你的私人 API Key
* 安装`chatnio-node`并编写测试源文件 `test.js`

```javascript
// test.mjs
import {setKey, Chat} from "chatnio-node"

// 这里你换成你的 API Key，不要在会被公开发布的源代码中这样做
setKey("{{ API Key }}")
const chat = new Chat()
const res = await chat.ask({
    message: "hello! What's your name?"
})
console.log(res)
process.exit(0)
```

:warning: 安全起见，你不应该将你的 API Key 直接放置在源代码中，而是使用环境变量或者在你的应用中使用 `.env` 文件

* 执行程序

```shell
node test.mjs
```

* 输出结果大致如下：

```shell
{
  message: "Hello! I am OpenAI's language model, known as GPT-3. I don't have a specific name, but you can call me GPT-3 or AI. How can I assist you today?",
  keyword: '',
  quota: 0.000255
}
```

<p align="right">[<a href="#内容目录">↑ 回到顶部</a>]</p>

## 用法

* 导入

```javascript
import { Chat } from 'chatnio-node';
// 或者
const { Chat } = require("chatnio-node")
```

<p align="right">[<a href="#内容目录">↑ 回到顶部</a>]</p>

### API

* 认证 API：开始聊天前，设置你的个人 API Key

```javascript
import { setKey, setEndpoint } from 'chatnio-node';

// 设置你的 API Key
setKey("sk-...");

// 设置自定义 api endpoint (缺省: https://api.chatnio.net)
// setEndpoint("https://example.com/api");
```

- [聊天 API](https://docs.chatnio.net/kai-fa-zhe-zi-yuan/api-reference/liao-tian)：与许多可用的模型聊天
```javascript
import { Chat } from 'chatnio-node';

const chat = new Chat(-1); // id -1 (缺省): 创建新的对话。或者使用旧对话的 id，以接着之前的内容继续进行聊天

// 使用流
chat.askStream({ 
    message: "hello world", 
    model: "gpt-3.5-turbo-0613", // 缺省 gpt-3.5-turbo
    web: false 
}, (res) => {
  console.log(res);
});

// 不使用流
chat.ask({ message: "hi" })
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
```

- [对话 API](https://docs.chatnio.net/kai-fa-zhe-zi-yuan/api-reference/dui-hua)：对话负责管理不同主题的聊天记录

```javascript
import { getConversations, getConversation, deleteConversation } from 'chatnio-node';

// 官方 JS SDK 的 README 中说是：获取当前用户的所有对话信息
// 官方文档上的 API 接口参考中说：这里是列出最近 100 次对话
const conversations = await getConversations();

// 使用 id 加载对话
const conversation = await getConversation(1);

// 使用 id 删除对话
const state = await deleteConversation(1);
```

- [配额 API](https://docs.chatnio.net/kai-fa-zhe-zi-yuan/api-reference/pets)：弹性计费，按需使用
```javascript
import { getQuota, buyQuota } from 'chatnio-node';

// 查看剩余配额。浮点数
const quota = await getQuota();

// 购买配额，会扣除 Deeptrain 钱包余额
const state = await buyQuota(100);
```

- [订阅和礼包 API](https://docs.chatnio.net/kai-fa-zhe-zi-yuan/api-reference/ding-yue-he-li-bao)：订阅不同的计划
```javascript
import { getPackage, getSubscription, buySubscription } from 'chatnio-node';

// 查看礼包获取情况
const pkg = await getPackage();

// 查看当前已订阅的计划
const subscription = await getSubscription();

// 购买订阅计划
const state = await buySubscription(1, 1);
```

<p align="right">[<a href="#内容目录">↑ 回到顶部</a>]</p>

### 获取对话内容

:bulb: 对每个新的对话，发送的第一条信息是对话的`name`

:warning: `getConversations()` 接口虽然返回类型为 `Conversation[]`，但是每个`Conversation` 的 `message` 字段都是 `null`。只有使用 `getConversation(id)` 接口加载具体对话，才能获得对话完整的历史信息。

```javascript
import {Chat, getConversation, getConversations, setKey} from 'chatnio-node'

setKey("")

const msg1 = "Hello! My name is chat-nio."
const msg2 = "What's my name?"
// 创建一个新的对话。新对话接收到的第一个信息会作为对话的 name
const chat = new Chat(-1)
let res = await chat.ask({
    message: msg1
})
console.log(res);
res = await chat.ask({
    message: msg2
})
console.log(res);

// 获得最近的对话列表，并使用 name 找到上述聊天对应的对话的 id
const conversations = await getConversations();
const id = conversations.find(conv => conv.name === msg1).id

// 使用 id 获得对话的详细信息
const conversation = await getConversation(id)
console.log(conversation);

// 退出程序
process.exit(0)
```



输出结果大致如下：

```shell
{
  message: 'Hello chat-nio! How can I assist you today?',
  keyword: '',
  quota: 0.00156
}
{ message: 'Your name is chat-nio.', keyword: '', quota: 0.002385 }
{
  auth: false,
  user_id: 4470,
  id: 45,
  name: 'Hello! My name is chat-nio.',
  message: [
    { srole: 'user', content: 'Hello! My name is chat-nio.' },
    { role: 'assistant', content: 'Hello chat-nio! How can I assist you today?' },
    { role: 'user', content: "What's my name?" },
    { role: 'assistant', content: 'Your name is chat-nio.' }
  ],
  model: 'gpt-3.5-turbo',
  enable_web: false,
  shared: false,
  context: 0
}
```

<p align="right">[<a href="#内容目录">↑ 回到顶部</a>]</p>

## 构建

本项目使用`tsc`进行构建

```shell
npm run build
# 或者
yarn run build
```

<p align="right">[<a href="#内容目录">↑ 回到顶部</a>]</p>

## 常见问题解答

### 如何获得 API Key

* 登录官方 [Chatnio](https://chatnio.net) 网站
* 点击右上角的用户头像
* 选择`API 设置`菜单项 
* 复制你的私人 API Key

详细请查看 [API 快速入门 - Chat Nio](https://docs.chatnio.net/kai-fa-zhe-zi-yuan/api-kuai-su-ru-men#huo-qu-api-key)



### 如何查看所有可用的模型

如果你没有指定，缺省使用 `gpt-3.5-turbo`

访问 [api.chatnio.net/v1/models](https://api.chatnio.net/v1/models) 获得所有可用模型的列表

<p align="right">[<a href="#内容目录">↑ 回到顶部</a>]</p>

## 相关资源

官方仓库：[Deeptrain-Community/chatnio](https://github.com/Deeptrain-Community/chatnio)

其他 SDK：

* [JavaScript (用于浏览器)](https://github.com/Deeptrain-Community/chatnio-api-js)
* [Python](https://github.com/Deeptrain-Community/chatnio-api-python)
* [Golang](https://github.com/Deeptrain-Community/chatnio-api-go)
* [Java](https://github.com/hujiayucc/ChatNio-SDK-Java)

<p align="right">[<a href="#内容目录">↑ 回到顶部</a>]</p>
