import styled from "styled-components";

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

export const InputBasic = styled.input`
  width: 100%;
  height: 42px;
  font-size: 14px;
  border: 2px solid;
  box-sizing: border-box;
  border-radius: 30px;
  outline: none;
  padding: 16px;
  font-family: 'Work Sans', sans-serif;

  ::placeholder {
    font-family: 'Work Sans', sans-serif;
    color: #cecece;
    font-weight: normal;
    opacity: 1;
  }

  :-ms-input-placeholder {
    font-family: 'Work Sans', sans-serif;
    color: #cecece;
    font-weight: normal;
  }

  ::-ms-input-placeholder {
    font-family: 'Work Sans', sans-serif;
    color: #cecece;
    font-weight: normal;
  }
`;

export const InputErrorMenssage = styled.label`
  color: #c50e29;
  font-size: 12px;
  margin-top: 1%;
  margin-left: 1%;
  font-family: "Roboto", sans-serif;
`;

export const Label = styled.label`
   color: #555555;
   margin-left: 1px;
   margin-bottom: 8px;
   font-size: 14px;
   font-family: "Roboto", sans-serif;
   font-weight: 500;
   line-height: 16px;
`;