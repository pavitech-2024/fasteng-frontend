import '@testing-library/jest-dom';
import { render, waitFor, screen, fireEvent, within } from '@testing-library/react';
import useAuth from '@/contexts/auth';
import { useRouter } from 'next/router';
import samplesService from '@/services/soils/soils-samples.service';
import Samples from '@/pages/soils/samples';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/services/soils/soils-samples.service');
jest.mock('@/contexts/auth');

const mockUserId = 'user123';
const mockUser = { _id: mockUserId };

const mockResponse = {
  data: [
    { _id: 'material1', name: 'Material 1', type: 'inorganicSoil' },
    { _id: 'material2', name: 'Material 2', type: 'inorganicSoil' },
  ],
};

describe('Soil Samples page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/soils/samples',
      query: {},
      asPath: '/soils/samples',
      push: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
    });

    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (samplesService.getSamplesByUserId as jest.Mock).mockResolvedValue(mockResponse);
    (samplesService.deleteSample as jest.Mock).mockResolvedValue({});
  });

  it('should load and render samples', async () => {
    render(<Samples />);

    await waitFor(() => expect(samplesService.getSamplesByUserId).toHaveBeenCalledWith(mockUserId));

    for (const material of mockResponse.data) {
      expect(await screen.findByText(material.name)).toBeInTheDocument();
    }
  });

  it('should delete a sample correctly', async () => {
    render(<Samples />);

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
      expect(samplesService.deleteSample).toHaveBeenCalledWith('material1');
    });

    // Verifica se o reload removeu o material da tela
    await waitFor(() => {
      const table = screen.getByRole('table', { name: /materials table/i });
      const { queryByText } = within(table);

      expect(queryByText('Material 1')).not.toBeInTheDocument();
    });
  });

  it.skip('should edit a sample correctly', async () => {
    render(<Samples />);

    await waitFor(() => screen.findByText('Material 1'));

    const editButton = screen.getByTestId(`edit-material1`);
    fireEvent.click(editButton);

    expect(await screen.findByText(/Editar Material 1/i)).toBeInTheDocument();
  });
});
