import { NextPage } from 'next';
import WelcomeTemplate, { ButtonData, StepperDescriptions } from '@/components/templates/welcome';
import { AsphaltIcon, EssayIcon, MarshallIcon, MaterialsIcon, SuperpaveIcon } from '@/assets';

const Asphalt: NextPage = () => {
  const buttonsData: ButtonData[] = [
    {
      name: 'Materiais',
      icon: MaterialsIcon,
      description: 'Descrição sobre materiais',
    },
    {
      name: 'Ensaios',
      icon: EssayIcon,
      description: 'Descrição sobre ensaios',
    },
    {
      name: 'Dosagem Marshall',
      icon: MarshallIcon,
      description: 'Descrição sobre Marshall',
    },
    {
      name: 'Dosagem Superpave',
      icon: SuperpaveIcon,
      description: 'Descrição sobre Superpave',
    },
    {
      name: 'Dosagem Normas',
      icon: MaterialsIcon,
      description: 'Descrição sobre normas',
    },
    {
      name: 'Biblioteca',
      icon: MaterialsIcon,
      description: 'Descrição sobre biblioteca',
    },
  ];

  const stepperDescription: StepperDescriptions[] = [
    {
      name: 'Cadastrar',
      description: 'Cadastre um material',
    },
    {
      name: 'Registrar',
      description: 'Registre ensaios com o material',
    },
    {
      name: 'Relatorios',
      description: 'Gere relatórios sobre os ensaios',
    },
  ];

  return (
    <WelcomeTemplate
      title="Pavimentação"
      stepperDescription={stepperDescription}
      buttonsData={buttonsData}
      icon={AsphaltIcon}
      app="asphalt"
    />
  );
};

export default Asphalt;
