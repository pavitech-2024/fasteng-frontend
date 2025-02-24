import { NextPage } from 'next';
import { WelcomeData } from '@/components/templates/welcome';
import {
  AsphaltIcon,
  EssayIcon,
  LibraryIcon,
  MarshallIcon,
  MaterialsIcon,
  StandartsIcon,
  SuperpaveIcon,
} from '@/assets';
import { t } from 'i18next';
import { StepperData } from '@/components/atoms/stepper';
import WelcomeTemplateAsphalt from '@/components/templates/welcome/asphalt';

const Asphalt: NextPage = () => {
  const welcomeData: WelcomeData[] = [
    {
      name: t('navbar.materials'),
      icon: <MaterialsIcon width="30px" height="35px" />,
<<<<<<< HEAD
      description: t('welcome.materials.description'),
=======
      description: t('description.materials'),
>>>>>>> 5e294e0adfc76eab4b91977a30ee47890e9a506d
      path: '/asphalt/materials',
    },
    {
      name: t('navbar.essays'),
      icon: <EssayIcon width="30px" height="35px" />,
<<<<<<< HEAD
      description: t('welcome.materials.description'),
=======
      description: t('description.essays'),
>>>>>>> 5e294e0adfc76eab4b91977a30ee47890e9a506d
      path: '/asphalt/essays',
    },
    {
      name: t('navbar.marshall'),
      icon: <MarshallIcon width="30px" height="35px" />,
<<<<<<< HEAD
      description: t('welcome.materials.description'),
      path: '/asphalt/marshall',
=======
      description: t('description.marshall'),
      path: '/asphalt/dosages/marshall/create',
>>>>>>> 5e294e0adfc76eab4b91977a30ee47890e9a506d
    },
    {
      name: t('navbar.superpave'),
      icon: <SuperpaveIcon width="30px" height="35px" />,
<<<<<<< HEAD
      description: t('welcome.materials.description'),
      path: '/asphalt/superpave',
=======
      description: t('description.superpave'),
      path: '/asphalt/dosages/superpave/create',
>>>>>>> 5e294e0adfc76eab4b91977a30ee47890e9a506d
    },
    {
      name: t('navbar.standards'),
      icon: <StandartsIcon style={{ color: 'white', fontSize: '30px' }} />,
<<<<<<< HEAD
      description: t('welcome.materials.description'),
=======
      description: t('description.standards'),
>>>>>>> 5e294e0adfc76eab4b91977a30ee47890e9a506d
      path: '/asphalt/standards',
    },
    {
      name: t('navbar.library'),
      icon: <LibraryIcon style={{ color: 'white', fontSize: '30px' }} />,
<<<<<<< HEAD
      description: t('welcome.materials.description'),
=======
      description: t('description.library'),
>>>>>>> 5e294e0adfc76eab4b91977a30ee47890e9a506d
      path: '/asphalt/library',
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
    <WelcomeTemplateAsphalt
      stepperData={stepperData}
      welcomeData={welcomeData}
      icon={<AsphaltIcon width="50px" height="50px" />}
    />
  );
};

export default Asphalt;
