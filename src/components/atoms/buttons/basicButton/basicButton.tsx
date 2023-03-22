import { ButtonLogoArea } from "./basicButtonStyle";

export interface IBasicButton {
  buttonStyle: buttonType;
  children: string;
  onClick: () => void;
}
export type buttonType = 'ghost' | 'normal' | 'large'

const BasicButton: React.FC<IBasicButton> = ({buttonStyle, children, onClick}: IBasicButton) => {
  return <ButtonLogoArea buttonStyle={buttonStyle} onClick={onClick}>{children}</ButtonLogoArea>
}

export default BasicButton;