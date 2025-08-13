import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import Materials from '../../../pages/asphalt/materials/index';
import useAuth from '@/contexts/auth';
import { useRouter } from 'next/router';

// Mock do useRouter antes de qualquer teste rodar
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock do auth context para fornecer o usuário
jest.mock('@/contexts/auth');

const mockUserId = process.env.NEXT_PUBLIC_TEST_USER_ID;

const mockUser = { _id: mockUserId };

describe('Materials page', () => {
  beforeEach(() => {
    // Configura o mock do useRouter
    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/asphalt/materials',
      query: {},
      asPath: '/asphalt/materials',
      push: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
    });

    // Configura o mock do auth
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
  });

  it('should fetch real data from backend and render materials', async () => {
    render(<Materials />);

    await waitFor(
      async () => {
        const materialFound = await screen.findByText('material teste (não excluir)');
        expect(materialFound).toBeInTheDocument();
      },
      { timeout: 10000 } // 10 segundos para waitFor
    );
  }, 20000); // 20 segundos para o teste inteiro
});
