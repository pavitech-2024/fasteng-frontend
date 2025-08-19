import '@testing-library/jest-dom';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import Materials from '../../../pages/asphalt/materials/index';
import materialsService from '@/services/asphalt/asphalt-materials.service';
import useAuth from '@/contexts/auth';
import { useRouter } from 'next/router';
import Rtcd_SERVICE from '@/services/asphalt/essays/rtcd/rtcd.service';
import Ddui_SERVICE from '@/services/asphalt/essays/ddui/ddui.service';
import Fwd_SERVICE from '@/services/asphalt/essays/fwd/fwd.service';
import Igg_SERVICE from '@/services/asphalt/essays/igg/igg.service';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/services/asphalt/asphalt-materials.service');
jest.mock('@/contexts/auth');
jest.mock('@/services/asphalt/essays/rtcd/rtcd.service');
jest.mock('@/services/asphalt/essays/ddui/ddui.service');
jest.mock('@/services/asphalt/essays/fwd/fwd.service');
jest.mock('@/services/asphalt/essays/igg/igg.service');

const mockUserId = process.env.NEXT_PUBLIC_TEST_USER_ID;
const mockUser = { _id: mockUserId };

const mockResponse = {
  data: [
    {
      materials: [{ _id: 'mat1', name: 'Material Teste', type: 'coarseAggregate' }],
      fwdEssays: [{ _id: 'fwd1', generalData: { name: 'FWD Teste' } }],
      iggEssays: [{ _id: 'igg1', generalData: { name: 'IGG Teste' } }],
      rtcdEssays: [{ _id: 'rtcd1', generalData: { name: 'RTCD Teste' } }],
      dduiEssays: [{ _id: 'ddui1', generalData: { name: 'DDUI Teste' } }],
    },
  ],
};

const deleteRtcdEssayMock = jest.fn().mockResolvedValue({});
const deleteDduiEssayMock = jest.fn().mockResolvedValue({});
const deleteFwdEssayMock = jest.fn().mockResolvedValue({});
const deleteIggEssayMock = jest.fn().mockResolvedValue({});

(Rtcd_SERVICE as jest.Mock).mockImplementation(() => ({ deleteRtcdEssay: deleteRtcdEssayMock }));
(Ddui_SERVICE as jest.Mock).mockImplementation(() => ({ deleteDduiEssay: deleteDduiEssayMock }));
(Fwd_SERVICE as jest.Mock).mockImplementation(() => ({ deleteFwdEssay: deleteFwdEssayMock }));
(Igg_SERVICE as jest.Mock).mockImplementation(() => ({ deleteIggEssay: deleteIggEssayMock }));

describe('Materials page integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/asphalt/materials',
      query: {},
      asPath: '/asphalt/materials',
      push: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
    });

    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (materialsService.getMaterialsByUserId as jest.Mock).mockResolvedValue(mockResponse);
    (materialsService.deleteMaterial as jest.Mock).mockResolvedValue({});
  });

  it('should load materials and essays correctly', async () => {
    render(<Materials />);

    // Aguarda carregamento inicial
    await waitFor(() => expect(materialsService.getMaterialsByUserId).toHaveBeenCalledWith(mockUserId));

    // Verifica se os dados aparecem na tela
    expect(await screen.findByText('Material Teste')).toBeInTheDocument();
    expect(await screen.findByText('FWD Teste')).toBeInTheDocument();
    expect(await screen.findByText('IGG Teste')).toBeInTheDocument();
    expect(await screen.findByText('RTCD Teste')).toBeInTheDocument();
    expect(await screen.findByText('DDUI Teste')).toBeInTheDocument();
  });

  it('should handle edit material', async () => {
    render(<Materials />);
    await waitFor(() => screen.findByText('Material Teste'));

    // Simula click em editar
    const editButton = screen.getByTestId('edit-mat1');
    fireEvent.click(editButton);

    expect(await screen.findByText('Editar Material Teste')).toBeInTheDocument();
  });

  it('should handle delete material and essays', async () => {
    render(<Materials />);
    await waitFor(() => screen.findByText('Material Teste'));

    // Exemplo: deletar material principal
    const deleteButton = screen.getByTestId('delete-mat1');
    fireEvent.click(deleteButton);

    await waitFor(() => expect(materialsService.deleteMaterial).toHaveBeenCalledWith('mat1'));

    // Exemplo: deletar RTCD essay
    const deleteRtcdButton = screen.getByTestId('delete-rtcd1');
    fireEvent.click(deleteRtcdButton);
    await waitFor(() => expect(deleteRtcdEssayMock).toHaveBeenCalledWith('rtcd1'));

    const deleteDduiButton = screen.getByTestId('delete-ddui1');
    fireEvent.click(deleteDduiButton);
    await waitFor(() => expect(deleteDduiEssayMock).toHaveBeenCalledWith('ddui1'));

    const deleteFwdButton = screen.getByTestId('delete-fwd1');
    fireEvent.click(deleteFwdButton);
    await waitFor(() => expect(deleteFwdEssayMock).toHaveBeenCalledWith('fwd1'));

    const deleteIggButton = screen.getByTestId('delete-igg1');
    fireEvent.click(deleteIggButton);
    await waitFor(() => expect(deleteIggEssayMock).toHaveBeenCalledWith('igg1'));
  });

  it('should add new material', async () => {
    render(<Materials />);
    await waitFor(() => screen.findByText('Material Teste'));

    const addButton = screen.getByTestId('add-material');
    fireEvent.click(addButton);

    await waitFor(() => expect(materialsService.getMaterialsByUserId).toHaveBeenCalledTimes(2));
  });
});
