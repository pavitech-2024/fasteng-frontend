import useAuth from "@/contexts/auth";
import ConcreteMaterials from "@/pages/concrete/materials";
import concreteMaterialService from "@/services/concrete/concrete-materials.service";
import { waitFor, render, screen } from "@testing-library/react";
import { useRouter } from "next/router";


jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/services/concrete/concrete-materials.service');
jest.mock('@/contexts/auth');

const mockUserId = 'user123';
const mockUser = { _id: mockUserId };

const mockResponse = {
  data: [
    {
      _id: 'container1',
      materials: [
        { _id: 'material1', name: 'Materials 1', type: 'inorganicSoil' },
        { _id: 'material2', name: 'Materials 2', type: 'organicSoil' },
      ],
    },
  ],
};

describe('Materials page', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/concrete/materials',
      query: {},
      asPath: '/concrete/materials',
      push: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
    });

    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (concreteMaterialService.getMaterialsByUserId as jest.Mock).mockResolvedValue(mockResponse);
  });

  it('should call getMaterialsByUserId and render materials correctly', async () => {
    render(<ConcreteMaterials />);

    await waitFor(() => {
      expect(concreteMaterialService.getMaterialsByUserId).toHaveBeenCalledWith(mockUserId);
    });

    // Espera até que os nomes das amostras apareçam na tela
    for (const material of mockResponse.data[0].materials) {
      expect(await screen.findByText(material.name, { exact: false })).toBeInTheDocument();
    }
  });
});
