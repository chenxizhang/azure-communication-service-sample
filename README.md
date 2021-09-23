# Azure communication service 范例项目
> 陈希章 2021-9-8

## 概述

这个例子演示了如何用ACS SDK实现聊天，音视频会议，以及跟Teams集成的功能。目前实现了聊天（单聊，或多聊）的场景，其他功能后续再添加，敬请期待）。

## 先决条件

请先克隆代码到本地。要启动本项目，你必须首先创建好Azure Communication Service的资源，并且复制得到以下两个信息，在项目根目录下面通过一个 `.env.local` 文件保存起来。

```
REACT_APP_endpointUrl=xxxxxx
REACT_APP_connectionString=xxxxxxx
```

请按照 <https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/create-communication-resource?tabs=windows&pivots=platform-azp> 的说明创建资源，并且复制下图中所列出来的两个信息放在 .env.local 文件中

![image](https://user-images.githubusercontent.com/1996954/132493277-06a6363a-2821-429a-9858-25d27446ab22.png)

要运行本项目，本地计算机需要安装 `NodeJS`的最新版本。


## 如何进行测试

通过 `yarn` 或 `npm install` 在本地安装依赖，然后 `yarn start` 或 `npm start` 启动项目，通常会自动打开 `http://localhost:3000` 这个地址。然后可以分别通过多个不同的浏览器窗口来进行测试。例如你用多个浏览器，或者你用一个浏览器，但一个用户在正常模式，另外一个用户在隐私模式。


## 单个用户创建聊天室并且发送消息

默认情况下会出现下面的界面

![image](https://user-images.githubusercontent.com/1996954/132490741-21d8eb94-5691-4c71-aec6-c5bc83c3dfed.png)

点击 `设置昵称`，在输入你的友好名称后，会显示出下面这样

![image](https://user-images.githubusercontent.com/1996954/132490974-d4de6c43-b696-4299-9812-fbbc4f8b2f90.png)

点击 `登录账号`，这个步骤会创建一个真正的ACS 账号，并且在本地缓存起来（是在 `localstorage` 中）

![image](https://user-images.githubusercontent.com/1996954/132491106-60ba46b4-0a0a-42e6-a49b-0d19d98f0b47.png)

点击 `创建聊天`，这个步骤会创建一个真正的ACS 聊天室，并且显示聊天窗口

![image](https://user-images.githubusercontent.com/1996954/132491308-d83cbdf8-c156-44ad-9a1d-ae418dfa60ce.png)

你现在可以在聊天框中输入文字，并且按下 `Ctrl+Enter（回车键）`发送消息

![image](https://user-images.githubusercontent.com/1996954/132491473-5e6ed082-45bc-4165-8f70-019d87387d12.png)


以上是第一次使用时的正常流程，如果你刷新页面，以上聊天室和已经发送的消息都不会消失，用户账号会被自动加载，你只需要点击一下 `加载聊天` 即可看到此前创建的聊天室和消息。




## 邀请其他人加入聊天室并且相互发送消息

用另外一个浏览器或者在当前浏览的隐私模式下打开同样的地址，然后一次设置昵称，登录账号。如下图所示

![image](https://user-images.githubusercontent.com/1996954/132492259-46f4a3d0-5183-4980-8e15-08209e5748de.png)

在第一个窗口的第一个聊天室中，点击添加用户的按钮

![image](https://user-images.githubusercontent.com/1996954/132492366-472ad639-52ff-4b7d-a04a-e247de84efd3.png)

在弹出的对话框中依次输入第二个用户的编号（在右侧窗口中的那个），以及昵称，这样就可以很容易地把他添加到对话中来

![image](https://user-images.githubusercontent.com/1996954/132492588-7bf16ba7-c1da-463a-ae3e-706f2d25e89d.png)

在第二个窗口点击 `加载聊天`，即可看到这个聊天室，并且带出来此前的聊天消息

![image](https://user-images.githubusercontent.com/1996954/132492643-362f2358-6442-4d91-b839-dd88141048a0.png)

这两个用户相互可以发送消息，如下所示

![image](https://user-images.githubusercontent.com/1996954/132492866-b7291396-28e4-4d6b-9fad-99bf7a7a7da2.png)


## 加入Teams会议

点击 “加入Teams会议” 的按钮，在弹出的对话框中输入Teams会议的链接，然后回车，即可用来宾账号加入到一个现有的Teams会议中。

![image](https://user-images.githubusercontent.com/1996954/134468428-8cda88b3-2a30-4040-b8f2-ef018d2a0003.png)

在这里还可以跟Teams会议用户直接聊天，如下图所示

![image](https://user-images.githubusercontent.com/1996954/134468494-50459135-53bd-49d6-90e6-cc9239146423.png)



