import { Container, Paper, Box } from '@mui/material';

const FormContainer = ({ children }) => {
  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {children}
        </Paper>
      </Box>
    </Container>
  );
};

export default FormContainer;