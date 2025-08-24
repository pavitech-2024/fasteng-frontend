---
sidebar_position: 1
---

# Documentação para a criação de materiais

O foco é a documentação da parte de criação de materiais, especificamente na parte de asfalto (por enquanto)

---

## Processo de adição de novos materiais

1. **Abertura do modal**

- O usuário clica em "Novo Material";
- A função 'handleOpenMaterial' é chamada;
- Em seguida, o modal CreateEditMaterialModal é aberto
- Quando o novo material é salvo, a lista de itens é atualizada usando `addNewMaterial`

2. **Inserindo as informações**

- O usuário adiciona as informações necessárias sobre o material;
- O tipo de material é carregado através do `AsphaltMaterialTypesEnum`

3. **Envio dos dados**

- O modal aciona a função de criação da API via `materialsService`;
- O novo material é vinculado ao backend;

4. **Atualização da lista de materiais**

- Quando um material é criado com sucesso, ocorre a chamada da função `addNewMaterial()`;
- O que essa função faz: 
  - Requisita a lista de materiais do usuário;
  - Atualiza o estado local (`materials`);
  - Fecha o modal e encerra o estado de carregamento.

---

## Função Responsável

### `addNewMaterial()`

```ts
const addNewMaterial = () => {
  setLoading(true);
  materialsService
    .getMaterialsByUserId(user._id)
    .then((response) => {
      setMaterials(response.data);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Failed to load materials:', error);
    });
};

Let's discover **Docusaurus in less than 5 minutes**.

## Getting Started

Get started by **creating a new site**.

Or **try Docusaurus immediately** with **[docusaurus.new](https://docusaurus.new)**.

### What you'll need

- [Node.js](https://nodejs.org/en/download/) version 18.0 or above:
  - When installing Node.js, you are recommended to check all checkboxes related to dependencies.

## Generate a new site

Generate a new Docusaurus site using the **classic template**.

The classic template will automatically be added to your project after you run the command:

```bash
npm init docusaurus@latest my-website classic
```

You can type this command into Command Prompt, Powershell, Terminal, or any other integrated terminal of your code editor.

The command also installs all necessary dependencies you need to run Docusaurus.

## Start your site

Run the development server:

```bash
cd my-website
npm run start
```

The `cd` command changes the directory you're working with. In order to work with your newly created Docusaurus site, you'll need to navigate the terminal there.

The `npm run start` command builds your website locally and serves it through a development server, ready for you to view at http://localhost:3000/.

Open `docs/intro.md` (this page) and edit some lines: the site **reloads automatically** and displays your changes.
