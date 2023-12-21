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
      description: t('description.materials'),
      path: '/asphalt/materials',
    },
    {
      name: t('navbar.essays'),
      icon: <EssayIcon width="30px" height="35px" />,
      description: t('description.essays'),
      path: '/asphalt/essays',
    },
    {
      name: t('navbar.marshall'),
      icon: <MarshallIcon width="30px" height="35px" />,
      description: t('description.marshall'),
      path: '/asphalt/dosages/marshall',
    },
    {
      name: t('navbar.superpave'),
      icon: <SuperpaveIcon width="30px" height="35px" />,
      description: t('description.superpave'),
      path: '/asphalt/dosages/superpave',
    },
    {
      name: t('navbar.standards'),
      icon: <StandartsIcon style={{ color: 'white', fontSize: '30px' }} />,
      description: t('description.standards'),
      path: '/asphalt/standards',
    },
    {
      name: t('navbar.library'),
      icon: <LibraryIcon style={{ color: 'white', fontSize: '30px' }} />,
      description: t('description.library'),
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
