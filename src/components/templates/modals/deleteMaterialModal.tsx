import { Dialog, DialogTitle, DialogContent, DialogContentText, Box, Button } from "@mui/material";
import { t } from "i18next";
import { toast } from "react-toastify";
import { DataToFilter } from "../materials";

interface DeleteMaterialModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rowToDelete: DataToFilter;
  tableData: any[];
  deleteMaterial: (id: string, searchBy: string, essayType?: string) => void;
  searchBy: string;
}

const DeleteMaterialModal = ({
  isOpen,
  setIsOpen,
  rowToDelete,
  tableData,
  deleteMaterial,
  searchBy,
}: DeleteMaterialModalProps) => {
  return (
    <Dialog open={isOpen}>
      <DialogTitle sx={{ fontSize: '1rem', textTransform: 'uppercase', fontWeight: 700 }} color="secondary">
        {t('materials.template.deleteTitle')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ textTransform: 'uppercase', fontSize: '14px' }}>
          {t('materials.template.deleteText')} <span style={{ fontWeight: 700 }}>{rowToDelete?.name}</span>?
        </DialogContentText>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: '1.3rem' }}>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              fontWeight: 700,
              fontSize: { mobile: '11px', notebook: '13px' },
              width: '40%',
            }}
            onClick={() => setIsOpen(false)}
          >
            {t('materials.template.cancel')}
          </Button>
          <Button
            variant="contained"
            sx={{
              fontWeight: 700,
              fontSize: { mobile: '11px', notebook: '13px' },
              color: 'primaryTons.white',
              width: '40%',
            }}
            onClick={() => {
              const selectedType = tableData.find((material) => material._id === rowToDelete?._id)?.type;
              try {
                toast.promise(async () => await deleteMaterial(rowToDelete?._id, searchBy, selectedType), {
                  pending: t('materials.template.toast.delete.pending') + rowToDelete?.name + '...',
                  success: rowToDelete?.name + t('materials.template.toast.delete.sucess'),
                  error: t('materials.template.toast.delete.error') + rowToDelete?.name + '.',
                });
                setIsOpen(false);
              } catch (error) {
                throw error;
              }
            }}
          >
            {t('materials.template.delete')}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMaterialModal;
