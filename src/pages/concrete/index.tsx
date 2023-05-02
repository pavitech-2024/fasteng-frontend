import { NextPage } from 'next';
import WelcomeTemplate, { ButtonData, StepperDescriptions } from '@/components/templates/welcome';
import { ConcreteIcon, MaterialsIcon } from '@/assets';

const Concrete: NextPage = () => {
  const buttonsData: ButtonData[] = [
    {
      name: 'Materiais',
      icon: MaterialsIcon,
      description: 'Descrição sobre materiais',
    },
    {
      name: 'Ensaios',
      icon: MaterialsIcon,
      description: 'Descrição sobre ensaios',
    },
    {
      name: 'Dosagem Marshall',
      icon: MaterialsIcon,
      description: 'Descrição sobre Marshall',
    },
    {
      name: 'Dosagem Superpave',
      icon: MaterialsIcon,
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
      title="Concreto"
      stepperDescription={stepperDescription}
      buttonsData={buttonsData}
      icon={ConcreteIcon}
      app="concrete"
    />
  );
};

export default Concrete;
