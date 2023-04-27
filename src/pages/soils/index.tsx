import { NextPage } from 'next';
import WelcomeTemplate, { ButtonData } from '@/components/templates/welcome';
import { SoilsIcon, MaterialsIcon} from '@/assets';

const Soils: NextPage = () => {
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

  return <WelcomeTemplate title="Solos" buttonsData={buttonsData} icon={SoilsIcon} app="soils" />;
};

export default Soils;
