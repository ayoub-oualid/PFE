import { CircularProgress, Box } from '@mui/material';

const Loader = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100px"
    >
      <CircularProgress size={100} />
    </Box>
  );
};

export default Loader;