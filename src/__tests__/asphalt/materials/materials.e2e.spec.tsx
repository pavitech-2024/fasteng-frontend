import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Materials from '../../../pages/asphalt/materials/index';
import useAuth from '@/contexts/auth';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/auth');

const mockUserId = process.env.NEXT_PUBLIC_TEST_USER_ID;
const mockUser = { _id: mockUserId };
const MATERIAL_NAME = 'cap 09';

describe('Materials page', () => {
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

  it(
    'should fetch real data from backend and find material even if paginated',
    async () => {
      render(<Materials />);
      const user = userEvent.setup();

      // Aguarda a paginação aparecer
      await screen.findByRole('navigation');

      // Coleta botões de página
      const pageButtons = screen
        .getAllByRole('button')
        .filter((btn) => btn.getAttribute('aria-label')?.match(/go to page/i));

      let found = false;

      for (const btn of pageButtons) {
        await user.click(btn);

        // Aguarda até que o material apareça na tabela, se existir
        const matchingCells = await screen.findAllByText(
          (content, element) =>
            element?.tagName === 'TD' && content.trim() === MATERIAL_NAME, undefined,
          { timeout: 5000 }
        ).catch(() => []);

        if (matchingCells.length > 0) {
          found = true;
          break;
        }
      }

      expect(found).toBe(true);
    },
    20000
  );
});