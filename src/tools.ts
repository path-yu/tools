// 将div,ul,li标签名替换为view标签
export const transformTag = (value:string) =>{

}
export const replaceTag = (value:string,tagReg:RegExp,strReg:RegExp,replaceVal:string) => {
 return  value.replaceAll(tagReg, (match: string, $1: string) => {
    return $1.replace(strReg,replaceVal);
  });
}
