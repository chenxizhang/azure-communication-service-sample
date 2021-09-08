# Azure communication service 范例项目
> 陈希章 2021-9-8

## 先决条件

要启动本项目，你必须首先创建好Azure Communication Service的资源，并且复制得到以下两个信息，在项目根目录下面通过一个 `.env.local` 文件保存起来。

```
REACT_APP_endpointUrl=xxxxxx
REACT_APP_connectionString=xxxxxxx
```

## 如何进行测试

通过 `yarn start` 启动项目，然后可以分别通过多个不同的浏览器窗口来进行测试。例如你用多个浏览器，或者你用一个浏览器，但一个用户在正常模式，另外一个用户在隐私模式。

