import { ButtonLogoArea } from "./orangeButtonStyle";

export interface IOrangeButton {
  buttonStyle: buttonType;
}
export type buttonType = 'ghost' | 'normal'


const OrangeButton: React.FC<IOrangeButton> = ({buttonStyle}: IOrangeButton) => {
  return <ButtonLogoArea buttonStyle={buttonStyle} />
}

export default OrangeButton;