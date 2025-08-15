// import { renderHook, act } from '@testing-library/react';
// import materialsService from '@/services/asphalt/asphalt-materials.service';
// import { deleteRtcdEssay } from '@/services/asphalt/asphalt-essays.service';
// import useAuth from '@/contexts/auth';
// import { useEffect, useState } from 'react';
// import { AsphaltMaterial } from '@/interfaces/asphalt';

// jest.mock('@/services/asphalt/asphalt-materials.service');
// jest.mock('@/services/asphalt/asphalt-essays.service');
// jest.mock('@/contexts/auth');

// const mockUser = { _id: 'user123' };

// function useMaterials() {
//   const { user } = useAuth();
//   const [materials, setMaterials] = useState<AsphaltMaterial[]>([]);
//   const [fwdEssays, setFwdEssays] = useState([]);
//   const [iggEssays, setIggEssays] = useState([]);
//   const [rtcdEssays, setRtcdEssays] = useState([]);
//   const [dduiEssays, setDduiEssays] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const loadMaterials = async (userId: string) => {
//     const response = await materialsService.getMaterialsByUserId(userId);
//     setMaterials(response.data[0].materials);
//     setFwdEssays(response.data[0].fwdEssays);
//     setIggEssays(response.data[0].iggEssays);
//     setRtcdEssays(response.data[0].rtcdEssays);
//     setDduiEssays(response.data[0].dduiEssays);
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadMaterials(user._id);
//   }, []);

//   return { materials, fwdEssays, iggEssays, rtcdEssays, dduiEssays, loading };
// }

// describe('handleDeleteMaterial via useMaterials', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
//   });

//   it('should call deleteMaterial and reload materials', async () => {
//     (materialsService.deleteMaterial as jest.Mock).mockResolvedValue({});
//     const mockLoadMaterials = jest.fn(); // Mock do loadMaterials
//     const { result } = renderHook(() => useMaterials());

//     // Supondo que o hook retorne handleDeleteMaterial
//     await act(async () => {
//       await result.current.handleDeleteMaterial('mat1', 'name', undefined, mockLoadMaterials);
//     });

//     expect(materialsService.deleteMaterial).toHaveBeenCalledWith('mat1');
//     expect(mockLoadMaterials).toHaveBeenCalledWith('user123');
//   });

//   it('should call deleteRtcdEssay for mix rtcd', async () => {
//     (deleteRtcdEssay as jest.Mock).mockResolvedValue({});
//     const mockLoadMaterials = jest.fn();
//     const { result } = renderHook(() => useMaterials());

//     await act(async () => {
//       await result.current.handleDeleteMaterial('essay1', 'mix', 'rtcd', mockLoadMaterials);
//     });

//     expect(deleteRtcdEssay).toHaveBeenCalledWith('essay1');
//     expect(mockLoadMaterials).toHaveBeenCalledWith('user123');
//   });
// });
