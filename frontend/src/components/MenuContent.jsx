import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import FolderSharedRoundedIcon from '@mui/icons-material/FolderSharedRounded';
import TrainRoundedIcon from '@mui/icons-material/TrainRounded';
import { Link } from 'react-router-dom';

const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon />, link: '/admin' },
  { text: 'Lines', icon: <TrainRoundedIcon />, link: '/lines' },
  { text: 'Reports', icon: <AssignmentRoundedIcon />, link: '/reports' },
  { text: 'Users', icon: <PeopleRoundedIcon />, link: '/users' },
  { text: 'Collaborators', icon: <FolderSharedRoundedIcon />, link: '/collaborators' },
];

const secondaryListItems = [
  { text: 'Home', icon: <HomeRoundedIcon />, link: '/home' },
  { text: 'Reports', icon: <AssignmentRoundedIcon />, link: '/myReports' },
  { text: 'Collaborators', icon: <FolderSharedRoundedIcon />, link: '/myCollaborators' },
];

export default function MenuContent({ role }) {
  const listItems = role === 'admin' ? mainListItems : secondaryListItems;
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {listItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton selected={index === 0} link={Link} to={item.link}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
             
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
    </Stack>
  );
}
