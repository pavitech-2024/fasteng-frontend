import '@testing-library/jest-dom';
import { render, waitFor, screen } from '@testing-library/react';
import Materials from '../../../pages/asphalt/materials/index';
import materialsService from '@/services/asphalt/asphalt-materials.service';
import useAuth from '@/contexts/auth';
import { useRouter } from 'next/router';

// Mock do useRouter antes de qualquer teste rodar:
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/services/asphalt/asphalt-materials.service');
jest.mock('@/contexts/auth');

const mockUser = { _id: 'user123' };

const mockResponse = {
  data: [
    {
      materials: [{ _id: 'mat1', name: 'Material Teste', type: 'coarseAggregate' }],
      fwdEssays: [
        {
          _id: 'fwd1',
          generalData: {
            name: 'FWD Teste',
            createdAt: new Date().toISOString(),
          },
        },
      ],
      iggEssays: [
        {
          _id: 'igg1',
          generalData: {
            name: 'IGG Teste',
            createdAt: new Date().toISOString(),
          },
        },
      ],
      rtcdEssays: [
        {
          _id: 'rtcd1',
          generalData: {
            name: 'RTCD Teste',
            createdAt: new Date().toISOString(),
          },
        },
      ],
      dduiEssays: [
        {
          _id: 'ddui1',
          generalData: {
            name: 'DDUI Teste',
            createdAt: new Date().toISOString(),
          },
        },
      ],
    },
  ],
};

describe('Materials page', () => {
  beforeEach(() => {
    // Configura o mock do useRouter para retornar o objeto esperado pelo componente
    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/asphalt/materials',
      query: {},
      asPath: '/asphalt/materials',
      push: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
    });

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
