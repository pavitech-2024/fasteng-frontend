import { NextPage } from 'next';
import WelcomeTemplate, { StepData, WelcomeData } from '@/components/templates/welcome';
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

const Asphalt: NextPage = () => {
  const welcomeData: WelcomeData[] = [
    {
      name: t('navbar.materials'),
      icon: <MaterialsIcon width="40px" height="45px" />,
      description: 'Descrição sobre materiais',
      path: '/asphalt/materials',
    },
    {
      name: t('navbar.essays'),
      icon: <EssayIcon width="40px" height="45px" />,
      description: 'Descrição sobre materiais',
      path: '/asphalt/essays',
    },
    {
      name: t('navbar.marshall'),
      icon: <MarshallIcon width="40px" height="45px" />,
      description: 'Descrição sobre materiais',
      path: '/asphalt/marshall',
    },
    {
      name: t('navbar.superpave'),
      icon: <SuperpaveIcon width="40px" height="45px" />,
      description: 'Descrição sobre materiais',
      path: '/asphalt/superpave',
    },
    {
      name: t('navbar.standards'),
      icon: <StandartsIcon style={{ color: 'white', fontSize: '40px' }} />,
      description: 'Descrição sobre materiais',
      path: '/asphalt/standards',
    },
    {
      name: t('navbar.library'),
      icon: <LibraryIcon style={{ color: 'white', fontSize: '40px' }} />,
      description: 'Descrição sobre materiais',
      path: '/asphalt/library',
    },
  ];

  const stepperData: StepData[] = [
    {
      step: '1',
      description: t('welcome.step.asphalt.1'),
    },
    {
      step: '2',
      description: t('welcome.step.asphalt.2'),
    },
    {
      step: '3',
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