import { useState } from 'react'
import './App.css'
import { Input,Tabs } from 'antd';
import {StyleTransform} from "./components/StyleTransform";
import {TagTransform} from "./components/TagTransform";

const { TabPane } = Tabs;
const { TextArea } = Input;

function App() {
  const [value, setValue] = useState('')
  return (
    <div className="App p-4">
      <Tabs defaultActiveKey="1">
        <TabPane tab="css样式转化" key="1">
          <StyleTransform/>
        </TabPane>
        <TabPane tab="标签样式转换" key="2">
          <TagTransform/>
        </TabPane>
        </Tabs>
    </div>
  )
}

export default App
