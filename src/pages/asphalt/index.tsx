import { NextPage } from 'next';
import WelcomeTemplate, { ButtonData } from '@/components/templates/welcome';
import { AsphaltIcon, MaterialsIcon } from '@/assets';

const Asphalt: NextPage = () => {
  const buttonsData: ButtonData[] = [
    {
      name: 'Materiais',
      icon: MaterialsIcon,
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
    },
    {
      name: 'Materiais',
      icon: MaterialsIcon,
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
    },
    {
      name: 'Materiais',
      icon: MaterialsIcon,
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
    },
  ];

  return <WelcomeTemplate title="Pavimentação" buttonsData={buttonsData} icon={AsphaltIcon} app="asphalt" />;
};

export default Asphalt;
