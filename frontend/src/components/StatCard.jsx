import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import useMediaQuery from '@mui/material/useMediaQuery';



function StatCard({ title, value,}) {
  const theme = useTheme();


  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card variant="outlined" sx={{ height: '100%', flexGrow: 1 }}>
      <CardContent>
        <Typography component="h1" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Stack
          direction="column"
          sx={{ justifyContent: 'space-between', flexGrow: '1', gap: 1 }}
        >

{/*               <Chip size="small" color={color} label={trendValues[trend]} />
{/*             <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {interval}
            </Typography> */}
          
          <Box sx={{ width: '100%', height: 10 }} />

          <Typography variant="h2" component="p">
                {value}
              </Typography>
              <Box sx={{ width: '100%', height: 10 }} />
          <Button
          variant="contained"
          size="small"
          color="primary"
          endIcon={<ChevronRightRoundedIcon />}
          fullWidth={isSmallScreen}
        >
          Voir Plus
        </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default StatCard;
