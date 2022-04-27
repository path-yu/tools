import { useState } from "react";
import { Button, message, Space } from "antd";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { oneDark } from "@codemirror/theme-one-dark";
import prettier from "prettier/standalone";
import parserHtml from "prettier/parser-html";

export const TagTransform = () => {
  // 匹配p字符串和span字符串
  const textReg = /(p|span)/g;
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("");
  const clipboardObj = navigator.clipboard;

  // 匹配li或者ul或者div字符串
  const divReg = /(li|div|ul)/g;
  const handleChange = (value: string) => {
    setInputValue(value);
    setTransformResultValue(value);
  };

  const setTransformResultValue = (value: string) => {
    //将div,ul,li标签名替换为view,其他保持不变
    let output = value.replace(divReg, "view").replace(textReg, "text");
    // 格式化html代码
    output = prettier.format(output, {
      parser: "html",
      plugins: [parserHtml],
    });
    console.log(output);
    setResult(output);
  };
  const handleCopy = () => {
    clipboardObj.writeText(result).then((r) => {
      message.info("复制成功");
    });
  };

  return (
    <div>
      <h2>转换html标签</h2>
      <CodeMirror
        value={inputValue}
        height="400px"
        style={{ marginTop: "20px" }}
        theme={oneDark}
        extensions={[html()]}
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
          value={result}
          height="400px"
          style={{ marginTop: "20px" }}
          theme={oneDark}
          extensions={[html()]}
        />
      </div>
    </div>
  );
};
