import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import UserProfile from './UserProfile';
import CollaboratorProfile from './CollaboratorProfile';
import InspectionProfile from './InspectionProfile';

const ProfileWrapper = () => {
  const { type, id } = useParams();

  if (!type || !id) {
    return <Navigate to="/" replace />;
  }

  switch (type) {
    case 'user':
      return <UserProfile userId={id} />;
    case 'collaborator':
      return <CollaboratorProfile collaboratorId={id} />;
    case 'inspection':
      return <InspectionProfile inspectionId={id} />;
    default:
      return <Navigate to="/" replace />;
  }
};

export default ProfileWrapper;