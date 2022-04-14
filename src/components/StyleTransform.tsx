import {useEffect, useState} from "react";
import {Input, Button, message, Switch} from 'antd';

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
  const clipboardObj = navigator.clipboard;
  // 匹配 rem单位或者px单位的正则
  const reg = /(?:(?:\d*\.)?\d+rem|\d+px)/g;
  // const reg = /(\d+\.?\d*)(rem|px)/g;
  // 匹配 img字符串
  const imgReg = /img/g;
  const handleChange = (e: any) => {
    let inputValue = e.target.value;
    setInputValue(inputValue);
    setTransformStyleOutputValue(inputValue)
  };
  const setTransformStyleOutputValue = (inputValue:string) => {
    // @ts-ignore
    let output = inputValue.replace(reg,  (match: string, $1: string, $2: string) => {
      if(match.startsWith('.')){
        match = '0' + match;
      }
      let num = parseFloat(match);
      if (num === 0) return 0;
      if (match.includes('rem')) {
        num = num * +remScale || 100
        console.log(num)

      }
      if (match.includes('px')) {
        num = num * +pxScale || 2;
      }
      return Math.round(num) + 'rpx';
    })
    if(isTransformImg){
      output = output.replace(imgReg, (match: string) => {
        return '.image';
      });
    }
    setOutputValue(output);
  };
  const handleCopy = () => {
    clipboardObj.writeText(outputValue).then(r => {
      message.info('复制成功');
    });
  };

  useEffect(() => {
    setTransformStyleOutputValue(inputValue);
  },[isTransformImg, remScale, pxScale]);

  return (
    <div>
      <h2>将rem和px单位转换为响应式的rpx单位</h2>
      <div className="flex items-center justify-between" style={{width: '50vw', margin: "auto"}}>
        <span>
          是否替换img选择器为类名image
        </span>
        <Switch
          onChange={checked => setIsTransformImg(checked)}
          checked={isTransformImg} checkedChildren="开启"
          unCheckedChildren="关闭"
        />
        <Input
          style={{width: '30%'}}
          onChange={(e) => setRemScale(e.target.value)}
          value={remScale} placeholder="请输入rem单位转换比例大小"/>
        <Input
          style={{width: '30%'}}
          onChange={(e) => setPxScale(e.target.value)}
          value={pxScale} placeholder="请输入px单位转换比例大小"/>
      </div>
      <TextArea
        style={{height: '300px', marginTop: '10px'}} value={inputValue}
        onChange={handleChange}/>
      <div>
        <Button className="my-4" onClick={handleCopy}>复制结果</Button>
        <TextArea style={{height: '400px'}} value={outputValue}/>
      </div>
    </div>
  )
}
