import '@testing-library/jest-dom';
import { render, waitFor, screen, fireEvent, within } from '@testing-library/react';
import ConcreteMaterials from '@/pages/concrete/materials';
import concreteMaterialService from '@/services/concrete/concrete-materials.service';
import useAuth from '@/contexts/auth';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/services/concrete/concrete-materials.service');
jest.mock('@/contexts/auth');

const mockUserId = 'user123';
const mockUser = { _id: mockUserId };

const mockResponse = {
  data: [
    { _id: 'material1', name: 'Material 1', type: 'coarseAggregate' },
    { _id: 'material2', name: 'Material 2', type: 'cement' },
  ],
};

describe('ConcreteMaterials page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/concrete/materials',
      query: {},
      asPath: '/concrete/materials',
      push: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
    });

    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (concreteMaterialService.getMaterialsByUserId as jest.Mock).mockResolvedValue(mockResponse);
    (concreteMaterialService.deleteMaterial as jest.Mock).mockResolvedValue({});
  });

  it('should load and render materials', async () => {
    render(<ConcreteMaterials />);

    await waitFor(() => expect(concreteMaterialService.getMaterialsByUserId).toHaveBeenCalledWith(mockUserId));

    for (const material of mockResponse.data) {
      expect(await screen.findByText(material.name)).toBeInTheDocument();
    }
  });

  it('should delete a material correctly', async () => {
    render(<ConcreteMaterials />);

    // Espera os materiais carregarem
    await waitFor(() => screen.getByText('Material 1'));

    // Clica no botão de delete do primeiro material
    const deleteButton = screen.getByTestId('delete-material1');
    fireEvent.click(deleteButton);

    // Clica no botão de confirmação dentro do modal
    const confirmButton = await screen.findByTestId('confirm-delete-material1');
    fireEvent.click(confirmButton);

    // Espera que o serviço de delete tenha sido chamado
    await waitFor(() => {
      expect(concreteMaterialService.deleteMaterial).toHaveBeenCalledWith('material1');
    });

    // Verifica se o reload removeu o material da tela
    await waitFor(() => {
      const table = screen.getByRole('table', { name: /materials table/i });
      const { queryByText } = within(table);

      expect(queryByText('Material 1')).not.toBeInTheDocument();
    });
  });

  it.skip('should edit a material correctly', async () => {
    render(<ConcreteMaterials />);

    await waitFor(() => screen.findByText('Material 1'));

    const editButton = screen.getByTestId(`edit-material1`);
    fireEvent.click(editButton);

    expect(await screen.findByText(/Editar Material 1/i)).toBeInTheDocument();
  });
});
