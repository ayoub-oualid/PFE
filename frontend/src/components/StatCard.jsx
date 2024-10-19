import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';

function HandleClick(link) {
  const Navigate = useNavigate();
  return () => {
    Navigate(link);
  };
}


function StatCard({ title, value, link}) {
  const theme = useTheme();


  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
    <Typography component="h1" variant="subtitle2" gutterBottom>
      {title}
    </Typography>
    
    <Typography 
      variant="h1" 
      component="h2" 
      sx={{ 
        flex: 1,
        mb: 2
      }}
    >
      {value}
    </Typography>

    <Button
      variant="contained"
      size="small"
      color="primary"
      endIcon={<ChevronRightRoundedIcon />}
      fullWidth={isSmallScreen}
      sx={{ mt: 'auto' }}
      onClick={HandleClick(link)}
    >
      Voir Plus
    </Button>
  </CardContent>
</Card>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default StatCard;
