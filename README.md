# Chat Nio Javascript Library

![NPM Version](https://img.shields.io/npm/v/chatnio-node)![NPM Downloads](https://img.shields.io/npm/dt/chatnio-node?label=total%20downloads)![GitHub last commit (branch)](https://img.shields.io/github/last-commit/peachest/chatnio-api-node/main)![GitHub License](https://img.shields.io/github/license/peachest/chatnio-api-node)

<p align="center">
A forked Javascript/Typescript library for the Chat Nio API on Node.
    <br />
    <br />
    <a href="README.md">English</a>
    ·
    <a href="README_zh.md">简体中文</a>
    <br />
    <br />
    <a href="#quick-start">Quick Start</a>
    ·
    <a href="https://github.com/peachest/artistic-readme-cli/issues">Report Bug</a>
    ·
    <a href="https://github.com/peachest/artistic-readme-cli/issues">Propose Feature</a>
    <br />
    <br />
    <a href="https://chatnio.net">Official Web APP</a>
    ·
    <a href="https://docs.chatnio.net/">Documentation</a>
    <br />
    <br />
    <a href="https://stats.deeptrain.net/">
        <img src="https://stats.deeptrain.net/repo/peachest/chatnio-api-node/?theme=light" alt="Stat"/>
    </a>
</p>




- Authors: Deeptrain Team
- Free software: MIT license
- Documentation: https://docs.chatnio.net



## Table of Contents

* [Features](#Feature)
* [Dependencies](#Dependencies)
* [Installation](#Installation)
* [Quick Start](#Quick-Start)
* [Usage](#Usage)
  * [API](#API)
  * [Example](#Example)
* [Build](#Build)
* [FAQs](#FAQs)
* [See Also](#See-Also)



## Features

Check official [documentation](#https://docs.chatnio.net) website

- Chat
- Conversation
- Quota
- Subscription and Package



## Dependencies

- [axios](https://github.com/axios/axios#browser-support) (for http request)
- [websockets](https://github.com/websockets/ws)(for chat stream)

<p align="right">[<a href="#Table of contents">↑ back to top</a>]</p>

## Installation

```shell
npm install chatnio-node
# or using yarn, pnpm
yarn add chatnio-node
```



## Quick Start

* Sign up and sign in official [Chatnio](https://chatnio.net) website
* Click the avatar at the top right corner
* Select 'API Settings'
* Copy your private API Key
* Install `chatnio-node` and write the source file `test.js`

```javascript
// test.mjs
import {setKey, Chat} from "chatnio-node"

// Place your API Key here. Don't do this in code that will be published to public
setKey("{{ API Key }}")
const chat = new Chat()
const res = await chat.ask({
    message: "hello! What's your name?"
})
console.log(res)
process.exit(0)
```

:warning: For security, you **should not** place your API Key directly in your source code, but **use** envrionment variables or `.env` file in your app.

* Execute the program

```shell
node test.mjs
```

* The output result may look like the following:

```shell
{
  message: "Hello! I am OpenAI's language model, known as GPT-3. I don't have a specific name, but you can call me GPT-3 or AI. How can I assist you today?",
  keyword: '',
  quota: 0.000255
}
```

<p align="right">[<a href="#Table of contents">↑ back to top</a>]</p>

## Usage

* Import

```javascript
import { Chat } from 'chatnio-node';
// or
const { Chat } = require("chatnio-node")
```

<p align="right">[<a href="#内容目录">↑ 回到顶部</a>]</p>

### API

* Authentication API：Set your own API Key before chatting

```javascript
import { setKey, setEndpoint } from 'chatnio-node';

// set your API Key
setKey("sk-...");

// set custom api endpoint (default: https://api.chatnio.net)
// setEndpoint("https://example.com/api");
```

- [Chat API](https://docs.chatnio.net/kai-fa-zhe-zi-yuan/api-reference/liao-tian)：Chat with multiple available models
```javascript
import { Chat } from 'chatnio-node';

const chat = new Chat(-1); // id -1 (default): create new conversation

// using stream
chat.askStream({ 
    message: "hello world", 
    model: "gpt-3.5-turbo-0613", // default gpt-3
    web: false 
}, (res) => {
  console.log(res);
});

// don't use stream
chat.ask({ message: "hi" })
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
```

- [Conversation API](https://docs.chatnio.net/kai-fa-zhe-zi-yuan/api-reference/dui-hua)：Manage chatting of different topics in conversation

```javascript
import { getConversations, getConversation, deleteConversation } from 'chatnio-node';

// get all conversations of current user
const conversations = await getConversations();

// load conversation by id
const conversation = await getConversation(1);

// delete conversation by id
const state = await deleteConversation(1);
```

- [Quota API](https://docs.chatnio.net/kai-fa-zhe-zi-yuan/api-reference/pets)：Elastic billing, usage-based
```javascript
import { getQuota, buyQuota } from 'chatnio-node';

// get quota
const quota = await getQuota();

// buy quota
const state = await buyQuota(100);
```

- [Subscription and Package](https://docs.chatnio.net/kai-fa-zhe-zi-yuan/api-reference/ding-yue-he-li-bao)：Subscribe for different plans
```javascript
import { getPackage, getSubscription, buySubscription } from 'chatnio-node';

// get package
const pkg = await getPackage();

// get subscription
const subscription = await getSubscription();

// buy subscription
const state = await buySubscription(1, 1);
```

<p align="right">[<a href="#Table of contents">↑ back to top</a>]</p>

### Example

**Get Conversation Content**

:bulb: For each new conversation, the first message received will be used as the conversation's name.

:warning:Although the `getConversations()` interface returns a data type of `Conversation[]`, the `message` field of each `Conversation` is `null` . To obtain the complete history of a conversation, load the conversation by `getConversation(id)` interface.

```javascript
import {Chat, getConversation, getConversations, setKey} from 'chatnio-node'

setKey("")

const msg1 = "Hello! My name is chat-nio."
const msg2 = "What's my name?"
// Create a new conversation. The first message received will be used as the conversation's name.
const chat = new Chat(-1)
let res = await chat.ask({
    message: msg1
})
console.log(res);
res = await chat.ask({
    message: msg2
})
console.log(res);

// Get the list of recent conversations, use the name to filter out conversation, and find the ID
const conversations = await getConversations();
const id = conversations.find(conv => conv.name === msg1).id

// Retrieve detailed conversation information by id
const conversation = await getConversation(id)
console.log(conversation);

// exit the program
process.exit(0)
```



Output may look like:

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

<p align="right">[<a href="#Table of contents">↑ back to top</a>]</p>

## Build

Use `tsc` to build

```shell
npm run build
# or
yarn run build
```

<p align="right">[<a href="#Table of contents">↑ back to top</a>]</p>

## FAQs

### Where to find API Key

* Sign in official [Chatnio](https://chatnio.net) website
* Click the avatar at the top right corner
* Select 'API Settings' . 
* Copy your private API Key

Check [API 快速入门 - Chat Nio](https://docs.chatnio.net/kai-fa-zhe-zi-yuan/api-kuai-su-ru-men#huo-qu-api-key) for detailed



### Where to find available models

Default is `gpt-3.5-turbo` if you don’t specified.

Check [api.chatnio.net/v1/models](https://api.chatnio.net/v1/models) for all available models.

<p align="right">[<a href="#Table of contents">↑ back to top</a>]</p>

## See also

Official repository：[Deeptrain-Community/chatnio](https://github.com/Deeptrain-Community/chatnio)

Other SDK：

* [JavaScript (For Browser)](https://github.com/Deeptrain-Community/chatnio-api-js)
* [Python](https://github.com/Deeptrain-Community/chatnio-api-python)
* [Golang](https://github.com/Deeptrain-Community/chatnio-api-go)
* [Java](https://github.com/hujiayucc/ChatNio-SDK-Java)

<p align="right">[<a href="#Table of contents">↑ back to top</a>]</p>
