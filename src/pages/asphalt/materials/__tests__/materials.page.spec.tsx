import { render, waitFor, screen } from '@testing-library/react';
import Materials from '../index';
import materialsService from '@/services/asphalt/asphalt-materials.service';
import useAuth from '@/contexts/auth';

jest.mock('@/services/asphalt/asphalt-materials.service');
jest.mock('@/contexts/auth');

const mockUser = { _id: 'user123' };

const mockResponse = {
  data: [
    {
      materials: [{ _id: 'mat1', name: 'Material Teste', type: 'coarseAggregate' }],
      fwdEssays: [{ id: 'fwd1' }],
      iggEssays: [{ id: 'igg1' }],
      rtcdEssays: [{ id: 'rtcd1' }],
      dduiEssays: [{ id: 'ddui1' }],
    },
  ],
};

describe('Materials page', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (materialsService.getMaterialsByUserId as jest.Mock).mockResolvedValue(mockResponse);
  });

  it('should call getMaterialsByUserId and update states correctly', async () => {
    render(<Materials />);

    await waitFor(() => {
      expect(materialsService.getMaterialsByUserId).toHaveBeenCalledWith('user123');
    });

    // Verifica se o nome do material aparece na tela
    expect(await screen.findByText('Material Teste')).toBeInTheDocument();
  });
});
