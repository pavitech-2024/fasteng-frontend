import '@testing-library/jest-dom';
import { render, waitFor, screen, fireEvent, within, act } from '@testing-library/react';
import Materials from '../../../pages/asphalt/materials/index';
import materialsService from '@/services/asphalt/asphalt-materials.service';
import useAuth from '@/contexts/auth';
import { useRouter } from 'next/router';
import Rtcd_SERVICE from '@/services/asphalt/essays/rtcd/rtcd.service';
import Ddui_SERVICE from '@/services/asphalt/essays/ddui/ddui.service';
import Fwd_SERVICE from '@/services/asphalt/essays/fwd/fwd.service';
import Igg_SERVICE from '@/services/asphalt/essays/igg/igg.service';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/services/asphalt/asphalt-materials.service');
jest.mock('@/contexts/auth');
jest.mock('@/services/asphalt/essays/rtcd/rtcd.service');
jest.mock('@/services/asphalt/essays/ddui/ddui.service');
jest.mock('@/services/asphalt/essays/fwd/fwd.service');
jest.mock('@/services/asphalt/essays/igg/igg.service');

const mockUserId = process.env.NEXT_PUBLIC_TEST_USER_ID;
const mockUser = { _id: mockUserId };

const mockResponse = {
  data: [
    {
      materials: [
        {
          _id: 'mat1',
          name: 'Material Teste',
          type: 'coarseAggregate',
          description: {
            source: 'Pedreira X',
            responsible: 'João',
            maxDiammeter: 20,
            aggregateNature: '',
            boughtDate: '',
            recieveDate: '',
            extractionDate: '',
            collectionDate: '',
            classification_CAP: '',
            classification_AMP: '',
            observation: '',
          },
        },
      ],
      fwdEssays: [{ _id: 'fwd1', generalData: { name: 'FWD Teste' } }],
      iggEssays: [{ _id: 'igg1', generalData: { name: 'IGG Teste' } }],
      rtcdEssays: [{ _id: 'rtcd1', generalData: { name: 'RTCD Teste' } }],
      dduiEssays: [{ _id: 'ddui1', generalData: { name: 'DDUI Teste' } }],
    },
  ],
};

const deleteRtcdEssayMock = jest.fn().mockResolvedValue({});
const deleteDduiEssayMock = jest.fn().mockResolvedValue({});
const deleteFwdEssayMock = jest.fn().mockResolvedValue({});
const deleteIggEssayMock = jest.fn().mockResolvedValue({});
const updateMaterialMock = jest.fn().mockResolvedValue({});

(Rtcd_SERVICE as jest.Mock).mockImplementation(() => ({ deleteRtcdEssay: deleteRtcdEssayMock }));
(Ddui_SERVICE as jest.Mock).mockImplementation(() => ({ deleteDduiEssay: deleteDduiEssayMock }));
(Fwd_SERVICE as jest.Mock).mockImplementation(() => ({ deleteFwdEssay: deleteFwdEssayMock }));
(Igg_SERVICE as jest.Mock).mockImplementation(() => ({ deleteIggEssay: deleteIggEssayMock }));

describe('Materials page integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/asphalt/materials',
      query: {},
      asPath: '/asphalt/materials',
      push: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
    });

    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (materialsService.getMaterialsByUserId as jest.Mock).mockResolvedValue(mockResponse);
    (materialsService.deleteMaterial as jest.Mock).mockResolvedValue({});
    (materialsService.editMaterial as jest.Mock).mockImplementation(updateMaterialMock);
  });

  it.skip('should handle edit material via hook state', async () => {
    // 1. renderiza o componente
    const { rerender } = render(<Materials />);

    screen.debug(screen.getByTestId('materials-table'));

    // 2. espera o carregamento inicial
    await waitFor(() => screen.getByText('Material Teste'));

    // 3. abre o modal de edição
    fireEvent.click(screen.getByTestId('edit-mat1'));

    // 4. garante que o modal abriu
    expect(await screen.findByText(/Editar Material/i)).toBeInTheDocument();
    expect(await screen.findByText('Material Teste')).toBeInTheDocument();

    // 5. altera o nome no input
    const nameInput = screen.getByTestId('input-name');
    fireEvent.change(nameInput, { target: { value: 'Material Editado' } });

    // 6. prepara o mock da chamada update + refetch
    (materialsService.getMaterialsByUserId as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          ...mockResponse.data[0],
          materials: [{ ...mockResponse.data[0].materials[0], name: 'Material Editado' }],
        },
      ],
    });

    // 7. clica em salvar
    fireEvent.click(screen.getByTestId('submit-edit-material'));

    // 8. garante que updateMaterial foi chamado corretamente
    await waitFor(() => {
      expect(updateMaterialMock).toHaveBeenCalledWith('mat1', expect.objectContaining({ name: 'Material Editado' }));
    });

    // 9. simula rerender com o novo mock (como se viesse do servidor)
    rerender(<Materials />);

    // 10. garante que a tabela mostra o nome atualizado
    const table = await screen.findByTestId('materials-table');
    await waitFor(() => {
      expect(within(table).getByText(/Material Editado/i)).toBeInTheDocument();
    });
  });

  it('should handle delete material and essays', async () => {
    render(<Materials />);

    // Espera a tabela carregar
    const table = await screen.findByTestId('materials-table');
    expect(table).toBeInTheDocument();

    // Agrupa todos os itens (materiais + ensaios)
    const items = [
      ...mockResponse.data[0].materials,
      ...mockResponse.data[0].fwdEssays.map((e) => ({ ...e, type: 'fwd', name: e.generalData.name })),
      ...mockResponse.data[0].iggEssays.map((e) => ({ ...e, type: 'igg', name: e.generalData.name })),
      ...mockResponse.data[0].rtcdEssays.map((e) => ({ ...e, type: 'rtcd', name: e.generalData.name })),
      ...mockResponse.data[0].dduiEssays.map((e) => ({ ...e, type: 'ddui', name: e.generalData.name })),
    ];

    for (const item of items) {
      // Clica no botão de delete
      const deleteButton = await screen.findByTestId(`delete-${item._id}`);
      fireEvent.click(deleteButton);

      // Clica no botão de confirmação dedeleção
      const confirmButton = await screen.findByTestId(`confirm-delete-${item._id}`);
      fireEvent.click(confirmButton);

      await waitFor(() => {
        switch (item.type) {
          case 'rtcd':
            expect(deleteRtcdEssayMock).toHaveBeenCalledWith(item._id);
            break;
          case 'ddui':
            expect(deleteDduiEssayMock).toHaveBeenCalledWith(item._id);
            break;
          case 'fwd':
            expect(deleteFwdEssayMock).toHaveBeenCalledWith(item._id);
            break;
          case 'igg':
            expect(deleteIggEssayMock).toHaveBeenCalledWith(item._id);
            break;
          default:
            expect(materialsService.deleteMaterial).toHaveBeenCalledWith(item._id);
        }
      });
    }
  });
});
