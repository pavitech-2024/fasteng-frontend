import { Library } from '@/interfaces/common';
import { FilterOption } from '@/components/molecules/buttons/filter';
import { LibraryTemplate } from '@/components/templates/library';
import { NextPage } from 'next';

const ConcreteLibrary: NextPage = () => {
  const concreteData: Library[] = [
    // Add novos items
  ];

  const filterOptions: FilterOption[] = [
    { key: 'videos', title: 'Videos', isSelected: true },
    { key: 'articles', title: 'Artigos', isSelected: true },
    { key: 'books', title: 'Livros', isSelected: true },
  ];

  return <LibraryTemplate library={concreteData} filterOptions={filterOptions} />;
};

export default ConcreteLibrary;
