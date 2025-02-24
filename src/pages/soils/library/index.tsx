import { Library } from '@/interfaces/common';
import { FilterOption } from '@/components/molecules/buttons/filter';
import { LibraryTemplate } from '@/components/templates/library';
import { NextPage } from 'next';

const SoilLibrary: NextPage = () => {
  const soilData: Library[] = [
    {
      title: 'Deformação Permanente de Solos',
      link: 'https://www.youtube.com/embed/0nFu8P-2dZM',
      type: 'videos',
      key: 'soilDeformation',
    },
    {
      title: 'Ensaio de Compressão Triaxial',
      link: 'https://www.youtube.com/embed/GBrfPCJByp4',
      type: 'videos',
      key: 'triaxialCompression',
    },
  ];

  const filterOptions: FilterOption[] = [
    { key: 'videos', title: 'Videos', isSelected: true },
    { key: 'articles', title: 'Artigos', isSelected: true },
    { key: 'books', title: 'Livros', isSelected: true },
  ];

  return <LibraryTemplate library={soilData} filterOptions={filterOptions} />;
};

export default SoilLibrary;
