import {useState} from "react";
import {Button, Input, message, Switch} from "antd";

const {TextArea} = Input;
export const TagTransform = () => {
  // 匹配div标签
  const div = /<div\s*(.*?)>([\s\S]*?)<\/div>/g;
  // 匹配p标签或者span标签
  const textReg = /<(p|span)\s*(.*?)>([\s\S]*?)<\/(p|span)>/g;
  // 匹配所有图片标签
  const imgReg = /<img\s*(.*?)>/g;
  // 是否给图片添加image类名
  const [isAddImageClass, setIsAddImageClass] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');
  const clipboardObj = navigator.clipboard;

  const handleChange = (e: any) => {
    let value = e.target.value;
    setInputValue(value)
    setTransformResultValue(value)
  }

  const setTransformResultValue = (value:string) => {
    // 替换所有div标签为view标签, 所有的p标签或者span标签为text标签
    let output = value.replace(div, '<view>$2</view>');
    output = output.replace(textReg, '<text>$3</text>');
    output = output.replace(imgReg, (match: string, attr: string) => {
      if (isAddImageClass) {
        return `<image class="image" ${attr} />`
      } else {
        return `<image ${attr} />`
      }
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
    setTransformResultValue(inputValue)
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
    <TextArea
      style={{height: '300px', marginTop: '10px'}}
      value={inputValue}
      onChange={handleChange}
    />
    <div>
      <Button className="my-4" onClick={handleCopy}>复制结果</Button>
      <TextArea style={{height: '400px'}} value={result}/>
    </div>
  </div>
}
