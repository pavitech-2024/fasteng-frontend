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