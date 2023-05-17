import Header from '@/components/organisms/header';
import { CardContainer, Card } from '@/components/atoms/containers/card';
import Filter, { FilterOption } from '@/components/molecules/buttons/filter';
import { useEffect, useState } from 'react';
import { Essay } from '@/interfaces/common';
import { useTranslation } from 'react-i18next';
import { PageGenericContainer as Container } from '@/components/organisms/pageContainer';

interface EssaysTemplateProps {
  essays: Essay[];
  filterOptions?: FilterOption[];
}

export const EssaysTemplate = ({ essays, filterOptions }: EssaysTemplateProps) => {
  const [filters] = useState<string[]>(['all']);
  const [essaysFiltered, setEssaysFiltered] = useState<Essay[]>([]);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    setEssaysFiltered(essays);
  }, [essays, i18n.language]);

  // função que filtra os ensaios, atualiza os filtros e os ensaios filtrados
  const filterCallback = (key: string) => {
    const ThrowAll = () => filters.splice(0, filters.length) && filters.push('all');
    const DeleteByKey = (value) => filters.splice(filters.indexOf(value), 1);

    if (key === 'all') ThrowAll();
    else {
      filters.includes('all') && DeleteByKey('all');

      filters.includes(key) ? DeleteByKey(key) : filters.push(key);

      if (filters.length === 0 || filters.length > 2) ThrowAll();
    }

    filterOptions.map((filter) => {
      filters.some((filterSelected) => filterSelected === filter.key)
        ? (filter.isSelected = true)
        : (filter.isSelected = false);
    });

    const newEssays = filters.includes('all')
      ? essays
      : essays.filter((essay) => filters.some((filter) => filter === essay.type));

    setEssaysFiltered(newEssays);
  };
  return (
    <Container>
      <Header title={t('navbar.essays')}>
        {filterOptions && <Filter options={filterOptions} callback={filterCallback} />}
      </Header>
      <CardContainer>
        {essaysFiltered.map((essay) => {
          return <Card key={essay.key} data={essay} type={'essay'} hrefLink={essay.key} target="standard"></Card>;
        })}
      </CardContainer>
    </Container>
  );
};
