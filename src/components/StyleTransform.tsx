import { useEffect, useState } from "react";
import { Input, Button, message, Switch, Space} from "antd";
import CodeMirror from "@uiw/react-codemirror";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";
import prettier from "prettier/standalone";
import cssParser from "prettier/parser-postcss";


export const StyleTransform = () => {
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");
  // rem转换比例
  const [remScale, setRemScale] = useState("100");
  // px转换比例
  const [pxScale, setPxScale] = useState("2");
  // 是否转换css计算单位值
  const [isTransformCalcCss, setIsTransformCalcCss] = useState(true);
  // 是否删除注释代码
  const [removeCommentChecked, setRemoveCommentChecked] = useState(true);
  // 对话框是否显示
  const [isShowModal, setIsShowModal] = useState(false);
  const clipboardObj = navigator.clipboard;
  // 匹配 rem单位或者px单位的正则
  const reg = /(?:(?:\d*\.)?\d+rem|\d+px)/g;
  // 匹配小数除法运算表达式正则
  const regCalc = /\d+\.?\d*\/\d+\.?\d*/g;
  //匹配注释正则
  const regComment = /\/\*[\s\S]*?\*\//g;
  // 当前所有自定义规则列表
  const [ruleList, setRuleList] = useState([]);
  const handleChange = (value: string) => {
    setInputValue(value);
    setTransformStyleOutputValue(value);
  };

  const handleCopy = () => {
    clipboardObj.writeText(outputValue).then((r) => {
      message.info("复制成功");
    });
  };
  const setTransformStyleOutputValue = (inputValue: string) => {
    let output = inputValue;
    if (isTransformCalcCss) {
      output = inputValue.replaceAll(regCalc, (match: string) => {
        let [num1, num2] = match.split("/");
        return (Number(num1) / Number(num2)).toFixed(2);
      });
    }
    if (removeCommentChecked) {
      output = output.replaceAll(regComment, "");
    }
    output = output.replace(reg, (match: string) => {
      if (match.startsWith(".")) {
        match = "0" + match;
      }
      let num = parseFloat(match);
      if (num === 0) return "0";
      if (match.includes("rem")) {
        num = num * (+remScale || 100);
      }
      if (match.includes("px")) {
        num = num * (+pxScale || 2);
      }
      return Math.round(num) + "rpx";
    });
    try {
      //使用prettier格式化less代码
      output = prettier.format(output, {
        parser: "css",
        plugins: [cssParser],
      });
    } catch (error) {
      console.log("代码格式错误!");
    }
    setOutputValue(output);
  };
  useEffect(() => {
    setTransformStyleOutputValue(inputValue);
  }, [isTransformCalcCss, remScale, pxScale]);
  return (
    <div>
      <h2>将rem和px单位转换为响应式的rpx单位!</h2>
      <div className="flex items-center mt-2">
        <Switch
          style={{ margin: "0 10px" }}
          onChange={(checked) => setIsTransformCalcCss(checked)}
          checked={isTransformCalcCss}
        />
        <span>转换计算单位</span>
        <Switch
          style={{ margin: "0 10px" }}
          onChange={(checked) => setRemoveCommentChecked(checked)}
          checked={removeCommentChecked}
        />
        <span>清除注释代码</span>
      </div>
      <div className="flex items-center pt-4">
        <Space>
          <Input
            onChange={(e) => setRemScale(e.target.value)}
            value={remScale}
            placeholder="请输入rem单位转换比例大小"
          />
          <Input
            onChange={(e) => setPxScale(e.target.value)}
            value={pxScale}
            placeholder="请输入px单位转换比例大小"
          />
        </Space>
      </div>
      <CodeMirror
        value={inputValue}
        height="400px"
        style={{ marginTop: "20px" }}
        theme={oneDark}
        extensions={[css()]}
        onChange={handleChange}
      />
      <div>
        <Space>
          <Button className="my-4" onClick={() => setInputValue("")}>
            清空
          </Button>
          <Button className="my-4" onClick={handleCopy}>
            复制结果
          </Button>
        </Space>
        <CodeMirror
          style={{ height: "400px" }}
          value={outputValue}
          height="400px"
          theme={oneDark}
          extensions={[css()]}
        />
      </div>
    </div>
  );
};
