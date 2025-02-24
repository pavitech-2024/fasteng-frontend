import { NextPage } from 'next';
import WelcomeTemplate, { WelcomeData } from '@/components/templates/welcome';
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

const Asphalt: NextPage = () => {
  const welcomeData: WelcomeData[] = [
    {
      name: t('navbar.materials'),
      icon: <MaterialsIcon width="30px" height="35px" />,
      description: t('welcome.materials.description'),
      path: '/asphalt/materials',
    },
    {
      name: t('navbar.essays'),
      icon: <EssayIcon width="30px" height="35px" />,
      description: t('welcome.materials.description'),
      path: '/asphalt/essays',
    },
    {
      name: t('navbar.marshall'),
      icon: <MarshallIcon width="30px" height="35px" />,
      description: t('welcome.materials.description'),
      path: '/asphalt/marshall',
    },
    {
      name: t('navbar.superpave'),
      icon: <SuperpaveIcon width="30px" height="35px" />,
      description: t('welcome.materials.description'),
      path: '/asphalt/superpave',
    },
    {
      name: t('navbar.standards'),
      icon: <StandartsIcon style={{ color: 'white', fontSize: '30px' }} />,
      description: t('welcome.materials.description'),
      path: '/asphalt/standards',
    },
    {
      name: t('navbar.library'),
      icon: <LibraryIcon style={{ color: 'white', fontSize: '30px' }} />,
      description: t('welcome.materials.description'),
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
    <WelcomeTemplate
      stepperData={stepperData}
      welcomeData={welcomeData}
      icon={<AsphaltIcon width="50px" height="50px" />}
    />
  );
};

export default Asphalt;
