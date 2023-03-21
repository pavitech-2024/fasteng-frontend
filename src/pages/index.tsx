import { ButtonLogoArea } from '@/components/atoms/buttons/orangeButton/orangeButtonStyle';
import { BlueLogin, ButtonLogin, HeaderLogin, LoginActions, DoubleColumn, LoginInputsArea, WhiteLogin, PlanArea, ButtonArea } from '@/components/styles/LoginStyles';
import { NextPage } from 'next';

interface ILogin {
  email: string;
  password: string;

}

const Login: NextPage<ILogin> = () => {
  return (
    <>
    {/** Modal forgot password*/}
      <DoubleColumn>
        <BlueLogin>
          {/** SVG Fasteng white*/}
          <p>
					Usar o FastEng é simples! Primeiramente, cadastre os materiais que serão usados no seu projeto de
					dosagem. Assim você pode criar um banco de dados para catologar seus materiais e suas informações.
					Calcule resultados de ensaios de caracterização que serão vinculados ao seus materiais e confira se
					estão adequados às especificações técnicas. Por fim, inicie seu projeto de dosagem. O FastEng te
					acompanha até a determinação do teor ótimo de ligante asfáltico.
				</p>
        <ButtonArea>
          <ButtonLogoArea buttonStyle={"normal"} >ASSINE</ButtonLogoArea>
          <ButtonLogoArea buttonStyle={"ghost"}>SAIBA MAIS</ButtonLogoArea>
        </ButtonArea>
        </BlueLogin>

        <WhiteLogin>
          <HeaderLogin>
            <h1>
              <strong>BEM-VINDO AO</strong>
            </h1>
            {/** SVG Fasteng black*/}
            <h1>O CAMINHO MAIS RÁPIDO PARA ENGENHARIA!</h1>
          </HeaderLogin>
          
          <LoginInputsArea>
            {/* <input></input>
            <input></input> */}

            <LoginActions>
              <ButtonLogin></ButtonLogin>
              <a>Esqueceu a senha?</a>
            </LoginActions>
          </LoginInputsArea>

          <PlanArea>
            <p>
              <small>© 2020 | Pavitech</small>
            </p>
				</PlanArea>
        </WhiteLogin>
      </DoubleColumn>
    </>
  );
};

export default Login;
