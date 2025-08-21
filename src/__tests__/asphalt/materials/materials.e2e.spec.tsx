import '@testing-library/jest-dom';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useAuth from '@/contexts/auth';
import { useRouter } from 'next/router';
import Materials from '@/pages/asphalt/materials';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/auth');

const mockUserId = process.env.NEXT_PUBLIC_TEST_USER_ID;
const mockUser = { _id: mockUserId };
const MATERIAL_NAME = 'material teste (não excluir)';

describe('Materials page E2E', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/asphalt/materials',
      query: {},
      asPath: '/asphalt/materials',
      push: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
    });

    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
  });

  it('should fetch real data from backend and find material even if paginated', async () => {
    render(<Materials />);
    const user = userEvent.setup();

    // Aguarda a paginação aparecer
    await screen.findByRole('navigation');

    // Coleta botões de página
    // Aguarda até que haja pelo menos um botão "go to page"
    const pageButtons = await screen.findAllByRole('button', { name: /go to page/i }).catch(() => []);

    // Primeiro, tenta achar na página inicial
    let matchingCells = await screen
      .findAllByText((content, element) => element?.tagName === 'TD' && content.trim() === MATERIAL_NAME, undefined, {
        timeout: 5000,
      })
      .catch(() => []);

    let found = matchingCells.length > 0;

    // Se não encontrou, então tenta nas outras páginas
    if (!found) {
      for (const btn of pageButtons) {
        await user.click(btn);
        matchingCells = await screen
          .findAllByText(
            (content, element) => element?.tagName === 'TD' && content.trim() === MATERIAL_NAME,
            undefined,
            {
              timeout: 5000,
            }
          )
          .catch(() => []);
        if (matchingCells.length > 0) {
          found = true;
          break;
        }
      }
    }

    expect(found).toBe(true);
  }, 60000);
});
