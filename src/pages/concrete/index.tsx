import { NextPage } from 'next';
import WelcomeTemplate, { WelcomeData } from '@/components/templates/welcome';
import { StepperData } from '@/components/atoms/stepper';
import { AbcpIcon, ConcreteIcon, EssayIcon, LibraryIcon, MaterialsIcon, StandartsIcon } from '@/assets';
import { t } from 'i18next';

const Concrete: NextPage = () => {
  const welcomeData: WelcomeData[] = [
    {
      name: t('navbar.materials'),
      icon: <MaterialsIcon width="30px" height="35px" />,
      /*description: 'Descrição sobre materiais',*/
      description: t('welcome.concrete.description'),
      path: '/concrete/materials',
    },
    {
      name: t('navbar.essays'),
      icon: <EssayIcon width="30px" height="35px" />,
      /*description: 'Descrição sobre materiais',*/
      description: t('welcome.concrete.description'),
      path: '/concrete/essays',
    },
    {
      name: t('navbar.abcp'),
      icon: <AbcpIcon width="35px" height="40px" />,
      /*description: 'Descrição sobre materiais',*/
      description: t('welcome.concrete.description'),
      path: '/concrete/abcp',
    },
    {
      name: t('navbar.standards'),
      icon: <StandartsIcon style={{ color: 'white', fontSize: '30px' }} />,
      /*description: 'Descrição sobre materiais',*/
      description: t('welcome.concrete.description'),
      path: '/concrete/standards',
    },
    {
      name: t('navbar.library'),
      icon: <LibraryIcon style={{ color: 'white', fontSize: '30px' }} />,
      /*description: 'Descrição sobre materiais',*/
      description: t('welcome.concrete.description'),
      path: '/concrete/library',
    },
  ];

  const stepperData: StepperData[] = [
    {
      step: 1,
      description: t('welcome.step.asphalt.1'),
    },
    {
      step: 2,
      description: t('welcome.step.asphalt.2'),
    },
    {
      step: 3,
      description: t('welcome.step.asphalt.3'),
    },
  ];

  return (
    <WelcomeTemplate
      stepperData={stepperData}
      welcomeData={welcomeData}
      icon={<ConcreteIcon width="50px" height="50px" />}
    />
  );
};

export default Concrete;
