import { Stack } from '@mui/material';

type NoDataFoundProps = {
  message?: string;
};

export const NoDataFound = ({ message }: NoDataFoundProps) => {
  return (
    <Stack height="100%" alignItems="center" justifyContent="center">
      {message}
    </Stack>
  );
};
