import React, { useState } from "react";
import Header from "@/components/organisms/header";
import { Library } from "@/interfaces/common";
import Filter, { FilterOption } from '@/components/molecules/buttons/filter';
import { VideoContainer as Container } from '@/components/organisms/pageContainer';
import { CardContainer, VideoCard } from "@/components/atoms/containers/video-card"; 
import { Card } from "@/components/atoms/containers/card";

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

  return (
    <Container>
      <Header title="Biblioteca de Pavimentação">
        {filterOptions && <Filter options={filterOptions} callback={filterCallback} />}
      </Header>
      <CardContainer>
        {libraryFiltered.map((item) => {
          // Verificando o tipo para renderizar o item adequado
          switch (item.type) {
            case 'videos':
              return <VideoCard key={item.key} data={item} type={'videos'} hrefLink={item.link} target="_blank" />;
            case 'articles':
              return <Card key={item.key} data={item} type={'library'} hrefLink={item.link} target="_blank" />;
            case 'books':
              return <Card key={item.key} data={item} type={'library'} hrefLink={item.link} target="_blank" />;
            default:
              return null;
          }
        })}
      </CardContainer>
    </Container>
  );
};
