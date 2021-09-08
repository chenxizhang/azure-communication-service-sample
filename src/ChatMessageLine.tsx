import { Space, Avatar, Divider, Typography } from "antd";
import React, { useContext } from "react";
import { UserOutlined } from "@ant-design/icons";
import { UserContext } from "./App";
import { ChatMessageItem } from "./Global";

const ChatMessageLine = ({
    avatar,
    username,
    date,
    body,
    id,
    userid
}: ChatMessageItem) => {
    const { id: currentUserId } = useContext(UserContext);

    if (username === "system") {
        const temp = body.split(",");
        //系统消息
        return (
            <p style={{ textAlign: "center" }}>
                <Space direction="vertical">
                    <Divider>系统消息</Divider>
                    <Typography.Paragraph>
                        {temp.length === 5
                            ? `${temp[4]} 添加了 ${temp[3]}`
                            : `添加用户（早期实现,没有显示名）`}
                    </Typography.Paragraph>
                </Space>
            </p>
        );
    }

    if (userid === currentUserId) {
        return (
            <p style={{ textAlign: "right" }}>
                <Space align="start">
                    <Space direction="vertical">
                        <span>
                            {username},{date}
                        </span>
                        <p>{body}</p>
                    </Space>
                    <Avatar
                        style={{ backgroundColor: "#87d068" }}
                        icon={<UserOutlined />}
                        src={avatar}
                    ></Avatar>
                </Space>
            </p>
        );
    } else {
        return (
            <p>
                <Space align="start">
                    <Avatar
                        style={{ backgroundColor: "#87d068" }}
                        icon={<UserOutlined />}
                        src={avatar}
                    ></Avatar>
                    <Space direction="vertical">
                        <span>
                            {username},{date}
                        </span>
                        <p>{body}</p>
                    </Space>
                </Space>
            </p>
        );
    }
};

export default ChatMessageLine;
