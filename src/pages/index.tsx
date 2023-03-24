import {
  BlueLogin,
  HeaderLogin,
  LoginActions,
  LoginInputsArea,
  WhiteLogin,
  ButtonArea,
} from '@/components/styles/LoginStyles';
import { NextPage } from 'next';
import BasicInput from '@/components/atoms/inputs/basicInput/basicInput';
import Footer from '@/components/molecules/footer/footer';
import BasicButton from '@/components/atoms/buttons/basicButton/basicButton';
import DoubleColumn from '@/components/atoms/doubleColumn/doubleColumn';

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
            Usar o FastEng é simples! Primeiramente, cadastre os materiais que serão usados no seu projeto de dosagem.
            Assim você pode criar um banco de dados para catologar seus materiais e suas informações. Calcule resultados
            de ensaios de caracterização que serão vinculados ao seus materiais e confira se estão adequados às
            especificações técnicas. Por fim, inicie seu projeto de dosagem. O FastEng te acompanha até a determinação
            do teor ótimo de ligante asfáltico.
          </p>
          <ButtonArea>
            <BasicButton
              buttonStyle="normal"
              type="submit"
              onClick={() => {
                ('');
              }}
            >
              ASSINE
            </BasicButton>
            <BasicButton
              buttonStyle="ghost"
              type="submit"
              onClick={() => {
                ('');
              }}
            >
              SAIBA MAIS
            </BasicButton>
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
            <BasicInput></BasicInput>
            <BasicInput></BasicInput>

            <LoginActions>
              <BasicButton
                buttonStyle={'large'}
                type="submit"
                onClick={() => {
                  ('');
                }}
              >
                ENTRAR
              </BasicButton>
              <a>Esqueceu a senha?</a>
            </LoginActions>
          </LoginInputsArea>

          <Footer />
        </WhiteLogin>
      </DoubleColumn>
    </>
  );
};

export default Login;
