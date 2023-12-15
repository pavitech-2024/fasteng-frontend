import Article from '../../../assets/asphalt/library/article.png';
import { Library } from '@/interfaces/common';
import { FilterOption } from '@/components/molecules/buttons/filter';
import { LibraryTemplate } from '@/components/templates/library';
import { NextPage } from 'next';

const AsphaltLibrary: NextPage = () => {
  const asphaltData: Library[] = [
    {
      title: 'FastEng - Dosagem Superpave (Composição Granulométrica)',
      link: 'https://www.youtube.com/embed/tX1Fd7FBXlk',
      type: 'videos',
      key: 'granulometry-asphalt',
    },
    {
      title: 'FastEng - Granulometria',
      link: 'https://www.youtube.com/embed/cQZhT5U7wAE',
      type: 'videos',
      key: 'granulometry',
    },
    {
      title: 'FastEng - Viscosidade',
      link: 'https://www.youtube.com/embed/Nnv-BmUBRyY',
      type: 'videos',
      key: 'rotational',
    },
    {
      title: 'Fadiga de Misturas Asfálticas: Ensaio por Compressão Diametral Indireta',
      link: 'https://www.youtube.com/embed/wFQHKPWWX4Q',
      type: 'videos',
      key: 'asphaltMix',
    },
    {
      title: 'Manual de Pavimentação',
      icon: Article,
      link: 'https://smartdoser.fastengapp.com.br/static/media/bookKennedy.75503a01.pdf',
      type: 'books',
      key: 'asphalt-guide',
    },
  ];

  const filterOptions: FilterOption[] = [
    { key: 'videos', title: 'Videos', isSelected: true },
    { key: 'articles', title: 'Artigos', isSelected: true },
    { key: 'books', title: 'Livros', isSelected: true },
  ];

  return <LibraryTemplate library={asphaltData} filterOptions={filterOptions} />;
};

export default AsphaltLibrary;