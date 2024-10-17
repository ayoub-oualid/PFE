import React, { useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useGetInspectionsByInspectorQuery } from '../slices/inspectionsApiSlice';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ThemeProvider } from '@mui/material';
import theme from '../theme';
import { useNavigate } from 'react-router-dom';

const InspectionCalendar = () => {
  const localizer = momentLocalizer(moment);

  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo?._id;
  const { data: inspections, isLoading, error } = useGetInspectionsByInspectorQuery(userId);
  const Navigate = useNavigate();

  const handleEventClick = (event) => {
    Navigate(`/details/inspection/${event.id}`);
  };

  const events = useMemo(() => {
    if (!inspections) return [];
    return inspections.map((inspection) => ({
      id: inspection._id,
      title: `${inspection.collaborator?.fullName}`,
      start: new Date(inspection.plannedDateTime),
      end: new Date(inspection.plannedDateTime),
      status: inspection.status 
    }));
  }, [inspections]);

  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor;
    let borderColor;

    switch (event.status) {
      case 'done':
        backgroundColor = '#4caf50'; // Green
        borderColor = '#45a049';
        break;
      case 'scheduled':
        backgroundColor = '#ff6f00'; // Orange
        borderColor = '#f57c00';
        break;
      case 'waiting-for-report':
        backgroundColor = '#f44336'; // Red
        borderColor = '#d32f2f';
        break;
      default:
        backgroundColor = '#9e9e9e'; // Grey for unknown status
        borderColor = '#757575';
    }

    const style = {
      backgroundColor,
      borderColor,
      borderRadius: '2px',
      opacity: 1,
      color: 'white',
      border: '2px solid',
      display: 'block'
    };

    return { style };
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading inspections.</p>;

  return (
    <ThemeProvider theme={theme}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 800, width: 900, margin: 20, lineHeight: 2 }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleEventClick}
      />
    </ThemeProvider>
  );
};

export default InspectionCalendar;