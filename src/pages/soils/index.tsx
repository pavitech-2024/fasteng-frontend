import { NextPage } from 'next';
import { WelcomeData } from '@/components/templates/welcome';
import { StepperData } from '@/components/atoms/stepper';
import { EssayIcon, LibraryIcon, MaterialsIcon, SoilsIcon, StandartsIcon } from '@/assets';
import { t } from 'i18next';
import WelcomeTemplateSoils from '@/components/templates/welcome/soils';

const Soils: NextPage = () => {
  const welcomeData: WelcomeData[] = [
    {
      name: t('navbar.samples'),
      icon: <MaterialsIcon width="30px" height="35px" />,
<<<<<<< HEAD
      /*description: 'Descrição sobre materiais',*/
      description: t('welcome.soils.description'),
=======
      description: t('description.materials'),
>>>>>>> 5e294e0adfc76eab4b91977a30ee47890e9a506d
      path: '/soils/samples',
    },
    {
      name: t('navbar.essays'),
      icon: <EssayIcon width="30px" height="35px" />,
<<<<<<< HEAD
      /*description: 'Descrição sobre materiais',*/
      description: t('welcome.soils.description'),
=======
      description: t('description.essays'),
>>>>>>> 5e294e0adfc76eab4b91977a30ee47890e9a506d
      path: '/soils/essays',
    },
    {
      name: t('navbar.standards'),
      icon: <StandartsIcon style={{ color: 'white', fontSize: '30px' }} />,
<<<<<<< HEAD
      /*description: 'Descrição sobre materiais',*/
      description: t('welcome.soils.description'),
=======
      description: t('description.standards'),
>>>>>>> 5e294e0adfc76eab4b91977a30ee47890e9a506d
      path: '/soils/standards',
    },
    {
      name: t('navbar.library'),
      icon: <LibraryIcon style={{ color: 'white', fontSize: '30px' }} />,
<<<<<<< HEAD
      /*description: 'Descrição sobre materiais',*/
      description: t('welcome.soils.description'),
=======
      description: t('description.library'),
>>>>>>> 5e294e0adfc76eab4b91977a30ee47890e9a506d
      path: '/soils/library',
    },
  ];

  const stepperData: StepperData[] = [
    {
      step: 1,
      description: t('welcome.step.soils.1'),
    },
    {
      step: 2,
      description: t('welcome.step.soils.2'),
    },
    {
      step: 3,
      description: t('welcome.step.asphalt.3'),
    },
  ];

  return (
    <WelcomeTemplateSoils
      stepperData={stepperData}
      welcomeData={welcomeData}
      icon={<SoilsIcon width="50px" height="50px" />}
    />
  );
};

export default Soils;
