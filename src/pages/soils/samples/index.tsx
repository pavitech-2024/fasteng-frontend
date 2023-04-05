import { NextPage } from 'next';
import MaterialsTemplate from '@/components/templates/materials';
import { Sample } from '@/interfaces/soils';
import { DropDownOption } from '@/components/atoms/inputs/dropDown';

export const getStaticProps = async () => {
  const types: DropDownOption[] = [
    { label: 'Todos', value: '' },
    { label: 'Solo Inorgânico', value: 'inorganicSoil' },
    { label: 'Solo Orgânico', value: 'organicSoil' },
    { label: 'Camada de Pavimento', value: 'pavementLayer' },
  ];
  return {
    props: {
      types,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};

interface SamplesProps {
  types: DropDownOption[];
}

const Samples: NextPage = ({ types }: SamplesProps) => {
  const samples: Sample[] = [
    { _id: '1', name: 'Amostra 1', type: 'inorganicSoil', registrationDate: new Date() },
    { _id: '2', name: 'Amostra 2', type: 'organicSoil', registrationDate: new Date() },
    { _id: '3', name: 'Amostra 3', type: 'pavementLayer', registrationDate: new Date() },
    { _id: '4', name: 'Amostra 4', type: 'inorganicSoil', registrationDate: new Date() },
    { _id: '5', name: 'Amostra 5', type: 'organicSoil', registrationDate: new Date() },
    { _id: '6', name: 'Amostra 6', type: 'pavementLayer', registrationDate: new Date() },
    { _id: '7', name: 'Amostra 7', type: 'inorganicSoil', registrationDate: new Date() },
    { _id: '8', name: 'Amostra 8', type: 'organicSoil', registrationDate: new Date() },
    { _id: '9', name: 'Amostra 9', type: 'pavementLayer', registrationDate: new Date() },
    { _id: '10', name: 'Amostra 10', type: 'inorganicSoil', registrationDate: new Date() },
    { _id: '11', name: 'Amostra 11', type: 'organicSoil', registrationDate: new Date() },
    { _id: '12', name: 'Amostra 12', type: 'pavementLayer', registrationDate: new Date() },
  ];

  return <MaterialsTemplate materials={samples} types={types} />;
};

export default Samples;
