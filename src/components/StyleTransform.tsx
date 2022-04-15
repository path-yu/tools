import {useEffect, useState} from "react";
import {Input, Button, message, Switch} from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import {css} from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';

const {TextArea} = Input;

export const StyleTransform = () => {
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  // rem转换比例
  const [remScale, setRemScale] = useState('100');
  // px转换比例
  const [pxScale, setPxScale] = useState('2');
  // 是否转换img字符串
  const [isTransformImg, setIsTransformImg] = useState(true);
  // 是否转换css计算单位值
  const [isTransformCalcCss, setIsTransformCalcCss] = useState(true);

  const clipboardObj = navigator.clipboard;
  // 匹配 rem单位或者px单位的正则
  const reg = /(?:(?:\d*\.)?\d+rem|\d+px)/g;
  // 匹配小数除法运算表达式正则
  const regCalc = /\d+\.?\d*\/\d+\.?\d*/g;
  // 匹配 img字符串
  const imgReg = /img/g;
  const handleChange = (value:string) => {
    setInputValue(value);
    setTransformStyleOutputValue(value)
  };
  const setTransformStyleOutputValue = (inputValue: string) => {
    let output = inputValue;
    if(isTransformCalcCss){
      output = inputValue.replaceAll(regCalc, (match: string) => {
        let [num1, num2] = match.split('/');
        return (Number(num1) / Number(num2)).toFixed(2);
      });
    }
    // @ts-ignore
    output = output.replace(reg, (match: string, $1: string, $2: string) => {
      if (match.startsWith('.')) {
        match = '0' + match;
      }
      let num = parseFloat(match);
      if (num === 0) return 0;
      if (match.includes('rem')) {
        num = num * +remScale || 100

      }
      if (match.includes('px')) {
        num = num * +pxScale || 2;
      }
      return Math.round(num) + 'rpx';
    })
    if (isTransformImg) {
      output = output.replace(imgReg, (match: string) => {
        return '.image';
      });
    }
    console.log(output)

    setOutputValue(output);
  };
  const handleCopy = () => {
    clipboardObj.writeText(outputValue).then(r => {
      message.info('复制成功');
    });
  };

  useEffect(() => {
    setTransformStyleOutputValue(inputValue);
  }, [isTransformImg, remScale, pxScale]);

  return (
    <div>
      <h2>将rem和px单位转换为响应式的rpx单位!</h2>
      <div className="flex items-center justify-center">
          <span className="px-4">
          是否添加image类名?
          </span>
        <Switch
          className="ml-2"
          onChange={checked => setIsTransformCalcCss(checked)}
          checked={isTransformCalcCss} checkedChildren="开启"
          unCheckedChildren="关闭"
        />
        <span className="px-4">
          是否转换类似计算单位 1/2rem?
        </span>
        <Switch
          className="ml-2"
          onChange={checked => setIsTransformImg(checked)}
          checked={isTransformImg} checkedChildren="开启"
          unCheckedChildren="关闭"
        />
      </div>
      <div className="flex items-center justify-between pt-4" style={{width: '50vw', margin: "auto"}}>
        <Input
          style={{width: '30%'}}
          onChange={(e) => setRemScale(e.target.value)}
          value={remScale} placeholder="请输入rem单位转换比例大小"/>
        <Input
          style={{width: '30%'}}
          onChange={(e) => setPxScale(e.target.value)}
          value={pxScale} placeholder="请输入px单位转换比例大小"/>
      </div>
      <CodeMirror
        value={inputValue}
        height="400px"
        style={{marginTop:'20px'}}
        theme={oneDark}
        extensions={[css()]}
        onChange={handleChange}
      />
      <div>
        <Button className="my-4" onClick={handleCopy}>复制结果</Button>
        <CodeMirror
          style={{height: '400px'}}
          value={outputValue}
          height="400px"
          theme={oneDark}
          extensions={[css()]}
        />
      </div>
    </div>
  )
}
