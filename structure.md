# Análise da Estrutura e Configuração do Projeto `fasteng-frontend`

Este documento detalha a estrutura de pastas, configurações e versões de ferramentas utilizadas no projeto `fasteng-frontend`.

## 1. Visão Geral e Versões

O projeto é uma aplicação web moderna construída com **Next.js** e **TypeScript**, utilizando **Yarn** como gerenciador de pacotes e **Zustand** para gerenciamento de estado.

-   **Versão do Next.js**: `^14.2.5`
-   **Versão do TypeScript**: `^5.9.2`

## 2. Estrutura de Pastas

A organização do projeto é modular, separando as responsabilidades em diretórios específicos, com uma clara distinção entre os domínios de negócio (`asphalt`, `concrete`, `soils`).

-   `public`: Contém todos os arquivos estáticos, como imagens, fontes e documentos modelo (e.g., planilhas `.xlsx`).
-   `src`: É o diretório principal do código-fonte da aplicação.
    -   `api`: Lógica para integração com APIs externas.
    -   `assets`: Recursos de mídia (ícones, imagens) organizados por domínio.
    -   `components`: Componentes React reutilizáveis, seguindo uma estrutura de *Atomic Design* (`atoms`, `molecules`, `organisms`) e também organizados por domínio de negócio.
    -   `contexts`: Contextos React para gerenciamento de estado global.
    -   `i18n`: Arquivos de internacionalização (traduções) para suportar múltiplos idiomas.
    -   `interfaces`: Definições de tipos e interfaces TypeScript, garantindo a tipagem em todo o projeto.
    -   `pages`: As páginas da aplicação, onde cada arquivo corresponde a uma rota. A estrutura de pastas aqui define a URL.
    -   `services`: Camada de serviços, responsável pela lógica de negócio e comunicação com o backend.
    -   `stores`: Lojas de estado gerenciadas pelo **Zustand**, separadas por funcionalidade.
    -   `styles`: Estilos globais e configurações de tema.
    -   `utils`: Funções utilitárias genéricas usadas em várias partes da aplicação.
-   `__tests__`: Contém os arquivos de teste para os componentes e lógicas da aplicação.

## 3. Configuração do TypeScript (`tsconfig.json`)

A configuração do TypeScript:

-   **`target: "ESNext"`**: O código é compilado para a versão mais recente do ECMAScript, garantindo o uso de funcionalidades modernas da linguagem.
-   **`module: "ESNext"`**: Utiliza a sintaxe de módulos do ECMAScript mais recente.
-   **`jsx: "preserve"`**: O compilador mantém o código JSX intacto para que o Next.js (via Babel) possa processá-lo e otimizá-lo.
-   **`strict: false`**: O modo de verificação estrita de tipos está desativado, o que oferece mais flexibilidade, mas com menos rigor na tipagem.
-   **`esModuleInterop: true`**: Habilita a interoperabilidade entre módulos CommonJS e ES Modules.
-   **`paths: { "@/*": ["./src/*"] }`**: Configura um alias de importação (`@/`) para o diretório `src`, simplificando as importações de módulos internos e evitando caminhos relativos complexos.
