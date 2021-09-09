import { ChatMessage, ChatThreadClient } from "@azure/communication-chat";
import { Mentions, Space, Typography, Button, message } from "antd";
import React, { useContext, useEffect, useState } from "react";
import ChatMessageLine from "./ChatMessageLine";
import pubsub from "pubsub-js";
import { UserContext } from "./App";
import {
    ChatMessageReceivedEvent,
    CommunicationUserKind
} from "@azure/communication-signaling";
import { UserAddOutlined } from "@ant-design/icons";
import moment from "moment";

const { Option } = Mentions;

const Chat = (props: {
    threadClient: ChatThreadClient;
    users?: string[];
    threadId: string;
}) => {
    const { Paragraph } = Typography;
    const [inputMessage, setMessage] = useState<string>();
    const { username } = useContext(UserContext);
    const [chatMessages, setChatMessages] = useState<ChatMessageItem[]>([]);

    useEffect(() => {
        //TODO #5:加载历史消息列表的排序问题（目前看好像是最新的在最顶上）

        const historyMessages = props.threadClient
            ?.listMessages()
            .byPage({ maxPageSize: 20 });

        if (historyMessages) {
            //TODO: #4 还可以读取更多，但显示仅读取最后一页，20条
            historyMessages.next().then(({ value }: { value: ChatMessage[] }) => {
                if (value && value.length > 0) {
                    const result = value
                        .map((x) => ({
                            id: x.id,
                            userid: x.sender
                                ? (x.sender as CommunicationUserKind).communicationUserId
                                : "",
                            body: x.content?.message!,
                            username: x.senderDisplayName ?? "",
                            date: moment(x.createdOn).format("yyyy-MM-DD HH-mm-ss")
                        }))
                        .filter((x) => x.userid !== "");

                    setChatMessages((s) => [...s, ...result]);
                }
            });
        }

        pubsub.subscribe(
            `message-${props.threadId}`,
            (msg: string, data: ChatMessageReceivedEvent) => {
                setChatMessages((s) => [
                    ...s,
                    {
                        id: data.id,
                        body: data.message,
                        userid: data.sender
                            ? (data.sender as CommunicationUserKind).communicationUserId
                            : "",
                        username: data.senderDisplayName,
                        date: moment(data.createdOn).format("yyyy-MM-DD HH-mm-ss")
                    }
                ]);
            }
        );
    }, [props.threadId, props.threadClient]);

    return (
        <div className="chatContainer">
            <Space align="center">
                <Paragraph copyable>{props.threadId}</Paragraph>
                <Button
                    icon={<UserAddOutlined />}
                    shape="circle"
                    onClick={() => {
                        const id = prompt("请输入用户编号");
                        const name = prompt("请输入用户昵称");

                        if (id && name) {
                            props.threadClient
                                ?.addParticipants({
                                    participants: [
                                        {
                                            id: {
                                                communicationUserId: id
                                            },
                                            displayName: name
                                        }
                                    ]
                                })
                                .then((x) => {
                                    message.success("添加成功，请通知对方点击加载聊天");
                                    props.threadClient?.sendMessage(
                                        {
                                            content: `add,${id},${props.threadId},${name},${username}`
                                        },
                                        {
                                            senderDisplayName: "system"
                                        }
                                    );
                                })
                                .catch((reason) => {
                                    message.error(reason);
                                });
                        }
                    }}
                ></Button>
            </Space>

            <div className="chatMessageList">
                {chatMessages && chatMessages.map((x) => <ChatMessageLine {...x} />)}
            </div>
            <div
                className="chatInputBox"
                onKeyUp={(event) => {
                    if (event.keyCode === 13 && event.ctrlKey && inputMessage) {
                        //发送消息
                        props.threadClient
                            ?.sendMessage(
                                {
                                    content: inputMessage
                                },
                                {
                                    senderDisplayName: username
                                }
                            )
                            .then((x) => setMessage(""))
                            .catch((reason) => console.log(reason));
                    }
                }}
            >
                <Mentions
                    placeholder="输入文字，可以艾特有关的人，按住Ctrl+Enter发送消息"
                    autoSize={{ minRows: 2, maxRows: 6 }}
                    value={inputMessage}
                    onChange={(value) => {
                        setMessage(value);
                    }}
                >
                    {props.users &&
                        props.users.map((u) => (
                            <Option key={u} value={u}>
                                {u}
                            </Option>
                        ))}
                </Mentions>
            </div>
        </div>
    );
};

export default Chat;