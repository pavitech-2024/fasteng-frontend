import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Samples from '../../../pages/soils/samples/index';
import useAuth from '@/contexts/auth';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/auth');

const mockUserId = process.env.NEXT_PUBLIC_TEST_USER_ID;
const mockUser = { _id: mockUserId };
const SAMPLE_NAME = 'amostra teste (não excluir)';

describe('Samples page E2E', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/soils/samples',
      query: {},
      asPath: '/soils/samples',
      push: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
    });

    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
  });

  it('should fetch real samples from backend and find a sample even if paginated', async () => {
    render(<Samples />);
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
