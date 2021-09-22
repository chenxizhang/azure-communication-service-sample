import "./App.css";
import Chat from "./Chat";
import "antd/dist/antd.css";
import { useEffect, useState } from "react";
import { Button, Space, Tabs } from "antd";
import React from "react";
import config from "./config";
import { ChatClient } from "@azure/communication-chat";
import pubsub from "pubsub-js";
import { CommunicationUserKind } from "@azure/communication-signaling";

export const UserContext = React.createContext<CurrentUser>(undefined!);
//TODO #6 考虑实现聊天室关闭 @chenxizhang
export default function App() {
  const [username, setUserName] = useState<string>();
  const [userId, setUserId] = useState<string>();
  const [chatClient, setChatClient] = useState<ChatClient>();
  const [threads, setThreads] = useState<ThreadInfo[]>([]);
  const [activeThread, setActiveThread] = useState<string>();


  useEffect(() => {
    const t = localStorage.getItem("username");
    if (t) {
      setUserName(t);
      config.getChatClient().then((v) => {
        setUserId(v.userId);
        //订阅用户添加的事件
        setChatClient(v.client);

        v.client.startRealtimeNotifications();
        v.client.on("participantsAdded", (e) => {
          if (e.participantsAdded.findIndex(x => (x.id as CommunicationUserKind).communicationUserId === v.userId) > -1) {
            const client = v.client.getChatThreadClient(e.threadId);
            client.getProperties().then((x) => {
              setThreads((t) => [
                {
                  threadId: x.id!,
                  displayName: x.topic,
                  threadClient: client
                },
                ...t
              ]);
            });
          }
        });

        v.client.on("chatMessageReceived", (e) => {
          pubsub.publish(`message-${e.threadId}`, e);
        });
      });
    }
  }, []);

  return (
    <div className="App">
      <Space direction="vertical" style={{ width: "100%" }}>
        {username && <h1>{username},你好！</h1>}
        {userId && <h2>编号:{userId}</h2>}
        <Space>
          {!username && (
            <Button
              type="primary"
              onClick={() => {
                let temp = prompt("请输入昵称");
                if (temp) {
                  setUserName(temp);
                  localStorage.setItem("username", temp);
                }
              }}
            >
              设置昵称
            </Button>
          )}

          {!chatClient && (
            <Button
              type="primary"
              onClick={() => {
                config.getChatClient().then((v) => {
                  setUserId(v.userId);
                  setChatClient(v.client);

                  v.client.startRealtimeNotifications();
                  v.client.on("chatMessageReceived", (e) => {
                    //收到消息
                    pubsub.publish(`message-${e.threadId}`, e);
                  });
                });
              }}
            >
              登录账号
            </Button>
          )}

          {chatClient && userId && username && (
            <>
              <Button
                type="primary"
                onClick={() => {
                  let temp = prompt("请为聊天命名");
                  if (temp) {
                    chatClient
                      .createChatThread(
                        {
                          topic: temp
                        },
                        {
                          participants: [
                            {
                              id: {
                                communicationUserId: userId
                              },
                              displayName: username
                            }
                          ]
                        }
                      )
                      .then((x) => {
                        //创建成功了
                        setThreads((t) => [
                          {
                            threadId: x.chatThread?.id!,
                            displayName: temp!,
                            threadClient: chatClient.getChatThreadClient(
                              x.chatThread?.id!
                            )
                          },
                          ...t
                        ]);

                        setActiveThread(x.chatThread?.id);
                      });
                  }
                }}
              >
                创建聊天
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  //TODO: #2 这里要考虑去重

                  const items = chatClient
                    .listChatThreads()
                    .byPage({ maxPageSize: 20 });
                  if (items) {
                    items.next().then((x) => {
                      //TODO #3:这里只加载了第一页，还可以完善，根据x.done的值判断是否要继续读取下一页
                      if (x.value && x.value.length > 0) {
                        const list = x.value.map((v: any) => ({
                          threadId: v.id,
                          displayName: v.topic,
                          threadClient: chatClient.getChatThreadClient(v.id)
                        }));
                        setThreads((t) => [...list, ...t]);
                      }
                    });
                  }
                }}
              >
                加载聊天
              </Button>
            </>
          )}
        </Space>

        {username && userId && threads && threads.length > 0 && (
          <UserContext.Provider
            value={{ id: userId, username: username, avatar: "test" }}
          >
            <Tabs
              defaultActiveKey={threads[0].threadId}
              activeKey={activeThread}
            >
              {threads.map((t) => (
                <Tabs.TabPane key={t.threadId} tab={t.displayName}>
                  <Chat threadId={t.threadId} threadClient={t.threadClient} />
                </Tabs.TabPane>
              ))}
            </Tabs>
          </UserContext.Provider>
        )}
      </Space>
    </div>
  );
}
