import { useState } from "react";
import "./App.css";
import { Button, ConfigProvider, Input, Tabs } from "antd";
import { StyleTransform } from "./components/StyleTransform";
import { TagTransform } from "./components/TagTransform";
import { GithubOutlined } from "@ant-design/icons";
const { TabPane } = Tabs;
import zhCN from "antd/lib/locale/zh_CN";
function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <div className="app p-4">
        <div className="flex justify-end">
          <Button
            className=""
            type="link"
            href="https://github.com/path-yu/tools"
          >
            <GithubOutlined />
            <span>源码地址</span>
          </Button>
        </div>
        <Tabs defaultActiveKey="1">
          <TabPane tab="css样式转化" key="1">
            <StyleTransform />
          </TabPane>
          <TabPane tab="标签样式转换" key="2">
            <TagTransform />
          </TabPane>
        </Tabs>
      </div>
    </ConfigProvider>
  );
}

export default App;
