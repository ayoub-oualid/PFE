import { Container, Card, Button, Typography, Box } from '@mui/material';

const Hero = () => {
  return (
    <Box py={5}>
      <Container maxWidth="md">
        <Card sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'grey.100' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            ONCF Inspection
          </Typography>
          <Typography variant="body1" paragraph align="center">
          Bienvenue sur la plateforme d'inspection ONCF, une application interne réservée aux employés de l'ONCF. Accédez à un espace sécurisé pour planifier et suivre les inspections ferroviaires, ainsi que gérer les rapports. Connectez-vous pour commencer.
          </Typography>
          <Box>
            <Button variant="contained" color="primary" href="/login" sx={{ mr: 2 }}>
              Connecter
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default Hero;