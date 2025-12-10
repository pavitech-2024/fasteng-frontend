import { renderHook, act, waitFor } from '@testing-library/react';
import materialsService from '@/services/asphalt/asphalt-materials.service';
import useAuth from '@/contexts/auth';
import Rtcd_SERVICE from '@/services/asphalt/essays/rtcd/rtcd.service';
import Ddui_SERVICE from '@/services/asphalt/essays/ddui/ddui.service';
import Fwd_SERVICE from '@/services/asphalt/essays/fwd/fwd.service';
import Igg_SERVICE from '@/services/asphalt/essays/igg/igg.service';
import { useMaterials } from '@/utils/hooks/asphalt/materials.hooks';

jest.mock('@/services/asphalt/asphalt-materials.service');
jest.mock('@/contexts/auth');
jest.mock('@/services/asphalt/essays/rtcd/rtcd.service');
jest.mock('@/services/asphalt/essays/ddui/ddui.service');
jest.mock('@/services/asphalt/essays/fwd/fwd.service');
jest.mock('@/services/asphalt/essays/igg/igg.service');

const mockUser = { _id: 'user123' };
const mockMaterialsResponse = {
  data: [
    {
      materials: [
        { _id: 'mat1', name: 'Material 1', type: 'coarseAggregate' },
        { _id: 'mat2', name: 'Material 2', type: 'fineAggregate' },
      ],
      fwdEssays: [{ _id: 'fwd1', generalData: { name: 'FWD Teste' } }],
      iggEssays: [{ _id: 'igg1', generalData: { name: 'IGG Teste' } }],
      rtcdEssays: [{ _id: 'rtcd1', generalData: { name: 'RTCD Teste' } }],
      dduiEssays: [{ _id: 'ddui1', generalData: { name: 'DDUI Teste' } }],
    },
  ],
};

// mocks para os serviços de essays
const deleteRtcdEssayMock = jest.fn().mockResolvedValue({});
const deleteDduiEssayMock = jest.fn().mockResolvedValue({});
const deleteFwdEssayMock = jest.fn().mockResolvedValue({});
const deleteIggEssayMock = jest.fn().mockResolvedValue({});

(Rtcd_SERVICE as jest.Mock).mockImplementation(() => ({ deleteRtcdEssay: deleteRtcdEssayMock }));
(Ddui_SERVICE as jest.Mock).mockImplementation(() => ({ deleteDduiEssay: deleteDduiEssayMock }));
(Fwd_SERVICE as jest.Mock).mockImplementation(() => ({ deleteFwdEssay: deleteFwdEssayMock }));
(Igg_SERVICE as jest.Mock).mockImplementation(() => ({ deleteIggEssay: deleteIggEssayMock }));

describe('useMaterials hook (asphalt)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (materialsService.getMaterialsByUserId as jest.Mock).mockResolvedValue(mockMaterialsResponse);
    (materialsService.deleteMaterial as jest.Mock).mockResolvedValue({});
  });

  describe('loadMaterials', () => {
    it('should fetch materials and update all states', async () => {
      const { result } = renderHook(() => useMaterials('asphalt'));

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.materials).toEqual(mockMaterialsResponse.data[0].materials);
      expect(result.current.fwdEssays).toEqual(mockMaterialsResponse.data[0].fwdEssays);
      expect(result.current.iggEssays).toEqual(mockMaterialsResponse.data[0].iggEssays);
      expect(result.current.rtcdEssays).toEqual(mockMaterialsResponse.data[0].rtcdEssays);
      expect(result.current.dduiEssays).toEqual(mockMaterialsResponse.data[0].dduiEssays);
    });
  });

  describe('handleDeleteMaterial', () => {
    it('should delete material by name/type', async () => {
      const { result } = renderHook(() => useMaterials('asphalt'));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.handleDeleteMaterial('mat1', 'name');
      });

      expect(materialsService.deleteMaterial).toHaveBeenCalledWith('mat1');
      expect(materialsService.getMaterialsByUserId).toHaveBeenCalledTimes(2);
    });

    it('should delete RTCD essay', async () => {
      const { result } = renderHook(() => useMaterials('asphalt'));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.handleDeleteMaterial('rtcd1', 'mix', 'rtcd');
      });

      expect(deleteRtcdEssayMock).toHaveBeenCalledWith('rtcd1');
      expect(materialsService.getMaterialsByUserId).toHaveBeenCalledTimes(2);
    });

    it('should delete DDUI essay', async () => {
      const { result } = renderHook(() => useMaterials('asphalt'));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.handleDeleteMaterial('ddui1', 'mix', 'ddui');
      });

      expect(deleteDduiEssayMock).toHaveBeenCalledWith('ddui1');
    });

    it('should delete FWD essay', async () => {
      const { result } = renderHook(() => useMaterials('asphalt'));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.handleDeleteMaterial('fwd1', 'stretch', 'fwd');
      });

      expect(deleteFwdEssayMock).toHaveBeenCalledWith('fwd1');
    });

    it('should delete IGG essay', async () => {
      const { result } = renderHook(() => useMaterials('asphalt'));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.handleDeleteMaterial('igg1', 'stretch', 'igg');
      });

      expect(deleteIggEssayMock).toHaveBeenCalledWith('igg1');
    });
  });

  describe('handleEditMaterial', () => {
    it('should set materialToEdit and open modal', async () => {
      const { result } = renderHook(() => useMaterials('asphalt'));
      await waitFor(() => expect(result.current.loading).toBe(false));

      act(() => {
        result.current.handleEditMaterial('mat2');
      });

      expect(result.current.materialToEdit).toEqual(mockMaterialsResponse.data[0].materials[1]);
      expect(result.current.isEdit).toBe(true);
      expect(result.current.openModal).toBe(true);
    });

    it('should set materialToEdit to null if not found', async () => {
      const { result } = renderHook(() => useMaterials('asphalt'));
      await waitFor(() => expect(result.current.loading).toBe(false));

      act(() => {
        result.current.handleEditMaterial('nonexistent');
      });

      expect(result.current.materialToEdit).toBeNull();
      expect(result.current.isEdit).toBe(true);
      expect(result.current.openModal).toBe(true);
    });
  });

  describe('addNewMaterial', () => {
    it('should reload materials and essays', async () => {
      const { result } = renderHook(() => useMaterials('asphalt'));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.addNewMaterial();
      });

      expect(materialsService.getMaterialsByUserId).toHaveBeenCalledTimes(2);
      expect(result.current.materials).toEqual(mockMaterialsResponse.data[0].materials);
    });
  });
});
