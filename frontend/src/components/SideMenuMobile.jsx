import * as React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';

import MenuButton from './MenuButton';
import MenuContent from './MenuContent';
import OptionsMenu from './OptionsMenu';

function SideMenuMobile({ open, onClose }) {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: 'none',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Stack
        sx={{
          maxWidth: '70dvw',
          height: '100%',
        }}
      >
        <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
          <Box sx={{ mr: 'auto' }}>
            <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
              {userInfo ? userInfo.name : 'Guest'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {userInfo ? userInfo.email : 'guest@example.com'}
            </Typography>
          </Box>
          <OptionsMenu />
        </Stack>
        <Divider />
        <MenuContent role={userInfo.role} />
      </Stack>
    </Drawer>
  );
}

SideMenuMobile.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SideMenuMobile;