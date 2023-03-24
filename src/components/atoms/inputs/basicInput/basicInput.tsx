import { InputContainer, InputBasic, InputErrorMenssage } from "./basicInputStyle";

export interface IBasicInput {
  inputStyle: inputType;
  labelStyle: labelType;
  disabled: boolean;
  invalid: boolean;
  activeColor: activeColorType;
  type: unknown;
  value: unknown;
}
export type inputType = 'invalid' | 'normal'
export type labelType = 'absent' | 'present'
export type activeColorType = 'invalid' | 'normal'

const BasicInput: React.FC = () => {
  return (
    <InputContainer>
      <InputBasic/>
      {/* {props.invalid && ( */}
        <InputErrorMenssage>Campo obrigatório</InputErrorMenssage>
      {/* )} */}
  </InputContainer>
  )
}

export default BasicInput;