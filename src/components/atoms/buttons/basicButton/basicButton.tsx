import { ButtonLogoArea } from "./basicButtonStyle";

export interface IBasicButton {
  buttonStyle: buttonAppearance;
  children: string;
  onClick: () => void;
  type: buttonType;
}
export type buttonAppearance = 'ghost' | 'normal' | 'large'
export type buttonType = 'submit' | 'reset' 

const BasicButton: React.FC<IBasicButton> = ({buttonStyle, children, onClick, type}: IBasicButton) => {
  return <ButtonLogoArea buttonStyle={buttonStyle} onClick={onClick} type={type}>{children}</ButtonLogoArea>
}

export default BasicButton;