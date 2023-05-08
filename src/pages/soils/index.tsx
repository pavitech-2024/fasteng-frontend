import { NextPage } from 'next';
import WelcomeTemplate, { StepData, WelcomeData } from '@/components/templates/welcome';
import { EssayIcon, LibraryIcon, MaterialsIcon, SoilsIcon, StandartsIcon } from '@/assets';
import { t } from 'i18next';

const Soils: NextPage = () => {
  const welcomeData: WelcomeData[] = [
    {
      name: t('navbar.samples'),
      icon: <MaterialsIcon width="40px" height="45px" />,
      description: 'Descrição sobre materiais',
      path: '/soils/samples',
    },
    {
      name: t('navbar.essays'),
      icon: <EssayIcon width="40px" height="45px" />,
      description: 'Descrição sobre materiais',
      path: '/soils/essays',
    },
    {
      name: t('navbar.standards'),
      icon: <StandartsIcon style={{ color: 'white', fontSize: '40px' }} />,
      description: 'Descrição sobre materiais',
      path: '/soils/standards',
    },
    {
      name: t('navbar.library'),
      icon: <LibraryIcon style={{ color: 'white', fontSize: '40px' }} />,
      description: 'Descrição sobre materiais',
      path: '/soils/library',
    },
  ];

  const stepperData: StepData[] = [
    {
      step: '1',
      description: t('welcome.step.soils.1'),
    },
    {
      step: '2',
      description: t('welcome.step.soils.2'),
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
      icon={<SoilsIcon width="50px" height="50px" />}
    />
  );
};

export default Soils;
