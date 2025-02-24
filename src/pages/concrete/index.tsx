import { NextPage } from 'next';
import { WelcomeData } from '@/components/templates/welcome';
import { StepperData } from '@/components/atoms/stepper';
import { AbcpIcon, ConcreteIcon, EssayIcon, LibraryIcon, MaterialsIcon, StandartsIcon } from '@/assets';
import { t } from 'i18next';
import WelcomeTemplateConcrete from '@/components/templates/welcome/concrete';

const Concrete: NextPage = () => {
  const welcomeData: WelcomeData[] = [
    {
      name: t('navbar.materials'),
      icon: <MaterialsIcon width="30px" height="35px" />,
<<<<<<< HEAD
      /*description: 'Descrição sobre materiais',*/
      description: t('welcome.concrete.description'),
=======
      description: t('description.materials'),
>>>>>>> 5e294e0adfc76eab4b91977a30ee47890e9a506d
      path: '/concrete/materials',
    },
    {
      name: t('navbar.essays'),
      icon: <EssayIcon width="30px" height="35px" />,
<<<<<<< HEAD
      /*description: 'Descrição sobre materiais',*/
      description: t('welcome.concrete.description'),
=======
      description: t('description.essays'),
>>>>>>> 5e294e0adfc76eab4b91977a30ee47890e9a506d
      path: '/concrete/essays',
    },
    {
      name: t('navbar.abcp'),
      icon: <AbcpIcon width="35px" height="40px" />,
<<<<<<< HEAD
      /*description: 'Descrição sobre materiais',*/
      description: t('welcome.concrete.description'),
      path: '/concrete/abcp',
=======
      description: 'Descrição sobre materiais',
      path: '/concrete/dosages/abcp',
>>>>>>> 5e294e0adfc76eab4b91977a30ee47890e9a506d
    },
    {
      name: t('navbar.standards'),
      icon: <StandartsIcon style={{ color: 'white', fontSize: '30px' }} />,
<<<<<<< HEAD
      /*description: 'Descrição sobre materiais',*/
      description: t('welcome.concrete.description'),
=======
      description: t('description.standards'),
>>>>>>> 5e294e0adfc76eab4b91977a30ee47890e9a506d
      path: '/concrete/standards',
    },
    {
      name: t('navbar.library'),
      icon: <LibraryIcon style={{ color: 'white', fontSize: '30px' }} />,
<<<<<<< HEAD
      /*description: 'Descrição sobre materiais',*/
      description: t('welcome.concrete.description'),
=======
      description: t('description.library'),
>>>>>>> 5e294e0adfc76eab4b91977a30ee47890e9a506d
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
    <WelcomeTemplateConcrete
      stepperData={stepperData}
      welcomeData={welcomeData}
      icon={<ConcreteIcon width="50px" height="50px" />}
    />
  );
};

export default Concrete;
