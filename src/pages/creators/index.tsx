import CreatorCard from "@/components/atoms/containers/creators-card";
import { Container } from "@mui/material";


const CreatorsPage = () => {
  const creatorData = [
    {
      name: 'Dr. John Kennedy Guedes Rodrigues',
      imageSrc: 'https://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=K4723233A5',
      description:
        'Professor Titular do Departamento de Engenharia Civil da Universidade Federal de Campina Grande atuando como coordenador da parceria entre o LEP/DEC/UFCG e a JBR Engenharia',
      lattesLink: 'http://lattes.cnpq.br/7834302744515283',
    },
    {
      name: 'Dr. Fabiano Pereira Cavalcante',
      imageSrc: 'https://servicosweb.cnpq.br/wspessoa/servletrecuperafoto?tipo=1&id=K4774119H7', 
      description:
        'Engenheiro Civil pela Universidade Federal da Paraíba, consultor em Engenharia Civil, representante regional da ABPV-PE e diretor na JBR Engenharia Ltda',
      lattesLink: 'http://buscatextual.cnpq.br/buscatextual/visualizacv.do?id=K4774119H7&tokenCaptchar=03AD1IbLDtl7ovj7PkaztB9NjsTqKOSADB8BbqTx_aBe6-SEiT98caN5p9lHY7mK-7R72yZlHX2gvG7b3fkUB4Vo8blTjE7_rS4lHiIRIRb0pJ-2WFU0tLshVK8mUxJ6B-dOeIH2tl3-o5i8YZcMjOtnlZyyAzsBDzRg_u46pegutvemJA6Qsztms0Ai2VnLTOP_ZOyrg19AcaGg-qetFikouGyXCGPPbYklrAPj0N1KdIXD2ZrifL8l78s9SUz7-6ZZauNxvuBsA3SASZIebRTHQUK-M7S5-WjmPlBDnXwozeUQelojJ7NRpzGc7w0pQvJeLXK2qGt7h3a9U_LBVDj58hyEmwDNqDZdjxN2a4npGgMtWpkuA-A4mWwbuzaO_bp8r_TlZEQMNdnJiZCwekGFzx_pA98NkaeIMI3nvKL4zBz4abE6bZqrtjL4UZ13qRqmI4p4eAn5fGTxoeIAid1B-3FFRy4pcU51nJCdBq51NjW8zs5aA2ZrC5tEFTdTR_ioLLjzUw77Kp5gcn0tjS8cF6zZdhRRa7-w',
    },
  ];

  return (
    <Container>
      <div style={{ padding: '5vh 0 0 3vw' }}>
        <h1>Idealizadores</h1>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {creatorData.map((creator) => (
          <CreatorCard key={creator.name} {...creator} />
        ))}
      </div>
    </Container>
  );
};

export default CreatorsPage;