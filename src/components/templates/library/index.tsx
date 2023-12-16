import React, { useState } from "react";
import Header from "@/components/organisms/header";
import { Library } from "@/interfaces/common";
import Filter, { FilterOption } from '@/components/molecules/buttons/filter';
import { PageGenericContainer as Container } from '@/components/organisms/pageContainer';
import { CardContainer, VideoCard } from "@/components/atoms/containers/video-card"; 
import { Card } from "@/components/atoms/containers/card";
import { LoadingText } from "@/components/atoms/containers/loading-card";

interface LibraryTemplateProps {
  library: Library[];
  filterOptions?: FilterOption[];
}

export const LibraryTemplate = ({ library, filterOptions }: LibraryTemplateProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>('videos');

  const libraryFiltered = library.filter((item) => item.type === selectedCategory);

  const filterCallback = (key: string) => {
    setSelectedCategory(key);
  };

  // Ajuste para definir o isSelected do filtro
  const updatedFilterOptions = filterOptions.map((filter) => {
    return {
      ...filter,
      isSelected: filter.key === selectedCategory,
    };
  });

  return (
    <Container>
      <Header title="Biblioteca">
        {filterOptions && <Filter options={updatedFilterOptions} callback={filterCallback} />}
      </Header>
      {libraryFiltered.length > 0 ? (
        <CardContainer>
          {libraryFiltered.map((item) => {
            // Verificando o tipo para renderizar o item adequado
            switch (item.type) {
              case 'videos':
                return <VideoCard key={item.key} data={item} type={'videos'} hrefLink={item.link} target="_blank" poster={""} />;
              case 'articles':
              case 'books':
                return <Card key={item.key} data={item} type={'library'} hrefLink={item.link} target="_blank" />;
              default:
                return null;
            }
          })}
        </CardContainer>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <img src=".\src\assets\common\Maquininha.gif" alt="Maquininha GIF" />
          <LoadingText>Nada em {selectedCategory === 'videos' ? 'Videos' : selectedCategory === 'articles' ? 'Artigos' : 'Livros'}</LoadingText>
        </div>
      )}
    </Container>
  );
};
