import '@testing-library/jest-dom';
import { render, waitFor, screen, within } from '@testing-library/react';
import Samples from '../../../pages/soils/samples/index';
import samplesService from '@/services/soils/soils-samples.service';
import useAuth from '@/contexts/auth';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/services/soils/soils-samples.service');
jest.mock('@/contexts/auth');

const mockUserId = 'user123';
const mockUser = { _id: mockUserId };

const mockResponse = {
  data: [
    {
      _id: 'container1',
      materials: [
        { _id: 'sample1', name: 'Sample 1', type: 'inorganicSoil' },
        { _id: 'sample2', name: 'Sample 2', type: 'organicSoil' },
      ],
    },
  ],
};

describe('Samples page', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/soils/samples',
      query: {},
      asPath: '/soils/samples',
      push: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
    });

    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (samplesService.getSamplesByUserId as jest.Mock).mockResolvedValue(mockResponse);
  });

  it('should call getSamplesByUserId and render samples correctly', async () => {
    render(<Samples />);

    await waitFor(() => {
      expect(samplesService.getSamplesByUserId).toHaveBeenCalledWith(mockUserId);
    });

    // Espera até que os nomes das amostras apareçam na tela
    for (const sample of mockResponse.data[0].materials) {
      expect(await screen.findByText(sample.name, { exact: false })).toBeInTheDocument();
    }
  });
});
