import {useEffect, useState} from "react";
import {Button, Input, message, Switch} from "antd";
import CodeMirror from '@uiw/react-codemirror';
import {html} from '@codemirror/lang-html';
import {oneDark} from '@codemirror/theme-one-dark';
import prettier from 'prettier/standalone';
import parserHtml from 'prettier/parser-html';
import {replaceTag} from "../tools";

export const TagTransform = () => {
  // 匹配p字符串和span字符串
  const textReg = /(p|span)/g;
  // 匹配文本标签位置
  const pOrSpanReg = /(<p.*>|<\/p.>|<span.*>|<\/span>)/g;
  // 匹配<img />标签中所有属性和指令
  const imgReg = /(img\s*[^>]*\s*\/?>)/g;
  //
  // 是否给图片添加image类名
  const [isAddImageClass, setIsAddImageClass] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');
  const clipboardObj = navigator.clipboard;
  const divReg = /(<div.*>|<\/div>|<ul.*>|<\/ul>|<li.*>|<\/li>)/g;
  // 匹配li或者ul或者div字符串
  const liReg = /(li|div|ul)/;

  const handleChange = (value: string) => {
    setInputValue(value)
    setTransformResultValue(value, isAddImageClass)
  }

  const setTransformResultValue = (value: string, isAddClass: boolean) => {
    //将div,ul,li标签名替换为view,其他保持不变
    let output = replaceTag(value, divReg,liReg, 'view');
    output = replaceTag(output, pOrSpanReg,textReg, 'text');
    // @ts-ignore
    output = output.replace(imgReg, (match: string, attr: string) => {
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
    // 格式化html代码
    output = prettier.format(output, {
      parser: 'html',
      plugins: [
        parserHtml
       ]
    });
    console.log(output);
    setResult(output)
  }
  const handleCopy = () => {
    clipboardObj.writeText(result).then(r => {
      message.info('复制成功');
    });
  }

  const handleSwitch = (checked: boolean) => {
    setIsAddImageClass(checked)
    setTransformResultValue(inputValue, checked)
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
      style={{marginTop: '20px'}}
      theme={oneDark}
      extensions={[html()]}
      onChange={handleChange}
    />
    <div>
      <Button className="my-4" onClick={handleCopy}>复制结果</Button>
      <CodeMirror
        value={result}
        height="400px"
        style={{marginTop: '20px'}}
        theme={oneDark}
        extensions={[html()]}
      />
    </div>
  </div>
}
