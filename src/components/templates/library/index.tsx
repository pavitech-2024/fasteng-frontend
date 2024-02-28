import React, { useState } from 'react';
import Header from '@/components/organisms/header';
import { Library } from '@/interfaces/common';
import Filter, { FilterOption } from '@/components/molecules/buttons/filter';
import { PageGenericContainer as Container } from '@/components/organisms/pageContainer';
import { VideoCardContainer, VideoCard } from '@/components/atoms/containers/video-card';
import { CardContainer, Card } from '@/components/atoms/containers/card';
import { LoadingImg, LoadingText } from '@/components/atoms/containers/loading-card';
import { Typography } from '@mui/material';

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
        <>
          {libraryFiltered.some((item) => item.type === 'videos') && (
            <VideoCardContainer>
              {libraryFiltered
                .filter((item) => item.type === 'videos')
                .map((item) => (
                  <div key={item.key}>
                    <VideoCard data={item} type={'videos'} hrefLink={item.link} target="_blank" poster={''} />
                  </div>
                ))}
            </VideoCardContainer>
          )}

          {libraryFiltered.some((item) => item.type !== 'videos') && (
            <CardContainer>
              {libraryFiltered
                .filter((item) => item.type !== 'videos')
                .map((item) => (
                  <div key={item.key}>
                    <Card data={item} type={'library'} hrefLink={item.link} target="_blank" />
                  </div>
                ))}
            </CardContainer>
          )}
        </>
      ) : (
        <div
          style={{
            fontFamily: 'Roboto',
            textAlign: 'center',
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh',
          }}
        >
          <Typography>
            <LoadingImg>
              <img
                src="https://cdn-icons-png.flaticon.com/512/270/270031.png"
                style={{ width: '12rem' }}
                alt="Rolo compressor PNG"
              />
            </LoadingImg>
          </Typography>
          <LoadingText>
            Nada em {selectedCategory === 'videos' ? 'Videos' : selectedCategory === 'articles' ? 'Artigos' : 'Livros'}
            ...
          </LoadingText>
        </div>
      )}
    </Container>
  );
};
