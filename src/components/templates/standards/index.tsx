import Header from '@/components/organisms/header';
import { Standard } from '@/interfaces/common';
import { useState } from 'react';
import Filter, { FilterOption } from '@/components/molecules/buttons/filter';
import { CardContainer, Card } from '@/components/atoms/containers/card';
import { PageGenericContainer as Container } from '@/components/organisms/pageContainer';
import { t } from 'i18next';

interface StandardsTemplateProps {
  standards: Standard[];
  filterOptions?: FilterOption[];
}

export const StandardsTemplate = ({ standards, filterOptions }: StandardsTemplateProps) => {
  const [filters] = useState<string[]>(['all']);
  const [standardsFiltered, setStandardsFiltered] = useState<Standard[]>(standards);

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

    const newStandards = filters.includes('all')
      ? standards
      : standards.filter((standard) => filters.some((filter) => filter === standard.type));

    setStandardsFiltered(newStandards);
  };

  return (
    <Container>
      <Header title={t('standards')}>{filterOptions && <Filter options={filterOptions} callback={filterCallback} />}</Header>
      <CardContainer>
        {standardsFiltered?.map((standard) => {
          // aqui o componente Card axige novas props agora que ele se tornou adptável à página em que é chamado;
          return (
            <Card key={standard.key} data={standard} type={'standard'} hrefLink={standard.link} target="_blank"></Card>
          );
        })}
      </CardContainer>
    </Container>
  );
};
