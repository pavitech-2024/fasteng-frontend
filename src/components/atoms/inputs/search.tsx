import { InputBase, Paper } from '@mui/material';
import { SearchIcon } from '@/assets';
import { t } from 'i18next';

interface SearchProps {
  sx?: { [key: string]: string | number | { [key: string]: string | number } };
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
}

const Search = ({ sx, placeholder, value, setValue }: SearchProps) => {
  return (
    <Paper
      component="div"
      sx={{
        ...sx,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 'none',
        border: '1px solid rgba(0, 0, 0, 0.28)',
      }}
      color="primary"
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder ? placeholder : t('materials.template.search.label')}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <SearchIcon sx={{ p: '10px' }} />
    </Paper>
  );
};

export default Search;
