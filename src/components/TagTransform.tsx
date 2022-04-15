import {useEffect, useState} from "react";
import {Button, Input, message, Switch} from "antd";
import CodeMirror from '@uiw/react-codemirror';
import {html} from '@codemirror/lang-html';
import { oneDark } from '@codemirror/theme-one-dark';

export const TagTransform = () => {
  // 匹配div或li或ui字符串
  const tag = /div|li|ul/g;
  // 匹配p字符串和span字符串
  const textReg = /(p|span)/g;
  // 匹配img字符串
  // 匹配<img />标签中所有属性和指令
  const imgReg = /(img\s*[^>]*\s*\/?>)/g;
  // 是否给图片添加image类名
  // 匹配多行注释或单行注释
  const commentReg = /(\/\*[\s\S]*?\*\/|\/\/.*)/g;
  const [isAddImageClass, setIsAddImageClass] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');
  const clipboardObj = navigator.clipboard;

  const handleChange = (value:string) => {
    setInputValue(value)
    setTransformResultValue(value,isAddImageClass)
  }

  const setTransformResultValue = (value:string,isAddClass:boolean) => {
    // 替换所有div标签为view标签, 所有的p标签或者span标签为text标签
    let output = value.replace(tag, 'view');
    output = output.replace(textReg, 'text');
    // @ts-ignore
    output = output.replace(imgReg, (match: string, attr: string) => {
      // 如果为注释则不替换
      if (commentReg.test(match)) {
        return match;
      }
      
      attr = attr.replace(/img/, 'image');
      // 如果需要给图片添加image类名, 如果本身有class属性, 则拼接到class属性中, 如果没有class属性, 则添加class属性
      if (isAddClass) {
        if (attr.includes('class')) {
          attr = attr.replace(/class\s*=\s*"/, 'class="image ');
        } else {
          attr = attr.replace(/\/?>/, ' class="image" />');
        }
      }
      return attr;
    });

    setResult(output)
  }
  const handleCopy = () => {
    clipboardObj.writeText(result).then(r => {
      message.info('复制成功');
    });
  }

  const handleSwitch = (checked: boolean) => {
    setIsAddImageClass(checked)
    setTransformResultValue(inputValue,checked)
  }
  return <div>
    <h2>转换html标签</h2>
    <div className="flex items-center justify-between" style={{width: '20vw', margin: "auto"}}>
      <span>
        是否给图片添加image类名
      </span>
      <Switch
        onChange={handleSwitch}
        checked={isAddImageClass} checkedChildren="开启"
        unCheckedChildren="关闭"
      />
    </div>
    <CodeMirror
      value={inputValue}
      height="400px"
      style={{marginTop:'20px'}}
      theme={oneDark}
      extensions={[html()]}
      onChange={handleChange}
    />
    <div>
      <Button className="my-4" onClick={handleCopy}>复制结果</Button>
      <CodeMirror
        value={result}
        height="400px"
        style={{marginTop:'20px'}}
        theme={oneDark}
        extensions={[html()]}
      />
    </div>
  </div>
}
