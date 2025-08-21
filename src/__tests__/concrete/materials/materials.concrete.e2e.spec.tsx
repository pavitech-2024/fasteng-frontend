// Este teste verifica se a página de materiais de concreto carrega os dados do backend e consegue localizar um material específico, mesmo que ele esteja em outra página da tabela paginada.

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useAuth from '@/contexts/auth';
import { useRouter } from 'next/router';
import ConcreteMaterials from '@/pages/concrete/materials';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/auth');

const mockUserId = process.env.NEXT_PUBLIC_TEST_USER_ID;
const mockUser = { _id: mockUserId };
const SAMPLE_NAME = 'material teste (não excluir)';

describe('Concrete materials page E2E', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/concrete/materials',
      query: {},
      asPath: '/concrete/materials',
      push: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
    });

    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
  });

  it('should fetch real materials from backend and find a material even if paginated', async () => {
    render(<ConcreteMaterials />);
    const user = userEvent.setup();

    // Aguarda a paginação aparecer
    await screen.findByRole('navigation');

    // Coleta botões de página
    // Aguarda até que haja pelo menos um botão "go to page"
    const pageButtons = await screen.findAllByRole('button', { name: /go to page/i }).catch(() => []);

    // Primeiro, tenta achar na página inicial
    let matchingCells = await screen
      .findAllByText((content, element) => element?.tagName === 'TD' && content.trim() === SAMPLE_NAME, undefined, {
        timeout: 5000,
      })
      .catch(() => []);

    let found = matchingCells.length > 0;

    // Se não encontrou, então tenta nas outras páginas
    if (!found) {
      for (const btn of pageButtons) {
        await user.click(btn);
        matchingCells = await screen
          .findAllByText((content, element) => element?.tagName === 'TD' && content.trim() === SAMPLE_NAME, undefined, {
            timeout: 5000,
          })
          .catch(() => []);
        if (matchingCells.length > 0) {
          found = true;
          break;
        }
      }
    }

    expect(found).toBe(true);
  }, 30000);
});
