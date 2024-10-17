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
import { Link, useLocation } from 'react-router-dom';

const mainListItems = [
  { text: 'Accueil', icon: <HomeRoundedIcon />, link: '/admin' },
  { text: 'Lignes', icon: <TrainRoundedIcon />, link: '/lines' },
  { text: 'Rapports', icon: <AssignmentRoundedIcon />, link: '/reports' },
  { text: 'Utilisateurs', icon: <PeopleRoundedIcon />, link: '/users' },
  { text: 'Collaborateurs', icon: <FolderSharedRoundedIcon />, link: '/collaborators' },
];

const secondaryListItems = [
  { text: 'Accueil', icon: <HomeRoundedIcon />, link: '/home' },
  { text: 'Rapports', icon: <AssignmentRoundedIcon />, link: '/myReports' },
  { text: 'Collaborateurs', icon: <FolderSharedRoundedIcon />, link: '/myCollaborators' },
];

export default function MenuContent({ role }) {
  const location = useLocation();
  const listItems = role === 'admin' ? mainListItems : secondaryListItems;

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {listItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton selected={location.pathname === item.link} component={Link} to={item.link}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}