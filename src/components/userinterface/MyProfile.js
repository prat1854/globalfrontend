import React, { useState, useEffect } from 'react';
import {
  Container, Box, Paper, Typography, Avatar, Grid, Divider, Button, 
  Card, CardContent, CircularProgress, Alert, Chip, Stack, Tabs, Tab
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import PublicIcon from '@mui/icons-material/Public';
import BadgeIcon from '@mui/icons-material/Badge';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ApiService from '../../Services/FetchNodeAdminServices';
import { useNavigate } from 'react-router-dom';
// Import the Submissions component
import Submissions from './Submissions';

// Styled components
const ProfileHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: '#f8f9fa',
  borderRadius: theme.shape.borderRadius,
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  fontSize: '3rem',
}));

const ProfileSection = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  overflow: 'visible',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
  },
}));

const ProfileItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(2),
}));

const ProfileItemLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  minWidth: 150,
  color: '#555',
}));

const ProfileItemValue = styled(Typography)(({ theme }) => ({
  color: '#333',
}));

export default function MyProfile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Retry function
    const attemptFetchProfile = async (retryCount = 0) => {
      try {
        setLoading(true);
        const response = await ApiService.getUserProfile();
        
        if (response.data) {
          // Transform the data to match the expected format
          const transformedData = {
            givenName: response.data.firstName || response.data.givenName || response.data.name?.split(' ')[0] || '',
            familyName: response.data.lastName || response.data.familyName || response.data.name?.split(' ').slice(1).join(' ') || '',
            email: response.data.email || '',
            username: response.data.username || '',
            affiliation: response.data.affiliation || '',
            country: response.data.country || '',
            orcidId: response.data.orcidId || '',
            areasOfInterest: Array.isArray(response.data.researchInterests)
              ? response.data.researchInterests
              : Array.isArray(response.data.areasOfInterest)
              ? response.data.areasOfInterest
              : typeof response.data.areas_of_interest === 'string'
              ? response.data.areas_of_interest.split(',').map(item => item.trim()).filter(Boolean)
              : [],
            joinedDate: response.data.createdAt || ''
          };
         // console.log('Transformed profile data:', transformedData);
          setProfileData(transformedData);
        } else {
          setError('No profile data returned from server');
        }
        setLoading(false);
      } catch (err) {
        // If retryCount is less than 2, try again
        if (retryCount < 2) {
          attemptFetchProfile(retryCount + 1); // Retry the request
        } else {
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            localStorage.removeItem('userToken'); // Clear invalid token
            setError('Authentication failed. Please login again.');
            setTimeout(() => {
              navigate('/login');
            }, 2000); // Redirect after showing message briefly
          } else if (err.code === 'ERR_NETWORK') {
            setError('Unable to connect to the server. Please check if the backend is running.');
          } else if (err.message) {
            setError(err.message);
          } else if (err.response) {
            setError(err.response.data?.message || 'Failed to load profile data');
          } else {
            setError('Failed to load profile data after multiple attempts. Please try again later.');
          }
          setLoading(false);
          setTimeout(() => {
            navigate('/login'); // Redirect to login page after showing the message
          }, 3000); // Redirect after 3 seconds
        }
      }
    };
  
    attemptFetchProfile(); // Start the first attempt
  }, [navigate]);  

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle when profile is still loading
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3, fontSize: '1.1rem', fontWeight: 'medium' }}>{error}</Alert>
        {error.includes('Authentication failed') ? (
          <Button variant="contained" onClick={() => navigate('/login')} sx={{ mt: 2 }}>
            Go to Login
          </Button>
        ) : (
          <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
            Back to Home
          </Button>
        )}
      </Container>
    );
  }

  // Get the actual profile data or use fallback
  const userProfile = profileData || {
    givenName: '',
    familyName: '',
    email: '',
    username: '',
    affiliation: '',
    country: '',
    orcidId: '',
    areasOfInterest: [],
    joinedDate: ''
  };

  // Check if we're using placeholder or real data
  const isPlaceholder = !profileData;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <ProfileHeader>
        <ProfileAvatar>
          {userProfile.givenName ? userProfile.givenName.charAt(0) : ''}
          {userProfile.familyName ? userProfile.familyName.charAt(0) : ''}
        </ProfileAvatar>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {`${userProfile.givenName || ''} ${userProfile.familyName || ''}`.trim() || 'No name provided'}
        </Typography>
        {userProfile.username && (
          <Typography variant="subtitle1" color="text.secondary">
            @{userProfile.username}
          </Typography>
        )}
        {isPlaceholder && (
          <Alert severity="info" sx={{ mt: 2, width: '100%' }}>
            Your profile data could not be loaded. Please check your connection to the backend.
          </Alert>
        )}
      </ProfileHeader>

      {/* Profile Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="profile tabs">
          <Tab label="Profile Information" />
          <Tab label="My Submissions" />
        </Tabs>
      </Box>

      {/* Profile Information Tab */}
      {activeTab === 0 && (
        <>
          <ProfileSection>
            <CardContent>
              <SectionTitle>
                <PersonIcon />
                Personal Information
              </SectionTitle>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <ProfileItem>
                    <ProfileItemLabel>Full Name:</ProfileItemLabel>
                    <ProfileItemValue>
                      {`${userProfile.givenName || ''} ${userProfile.familyName || ''}`.trim() || 'Not specified'}
                    </ProfileItemValue>
                  </ProfileItem>
                </Grid>
                <Grid item xs={12} md={6}>
                  <ProfileItem>
                    <ProfileItemLabel>Username:</ProfileItemLabel>
                    <ProfileItemValue>{userProfile.username}</ProfileItemValue>
                  </ProfileItem>
                </Grid>
                <Grid item xs={12} md={6}>
                  <ProfileItem>
                    <ProfileItemLabel>Email:</ProfileItemLabel>
                    <ProfileItemValue>{userProfile.email}</ProfileItemValue>
                  </ProfileItem>
                </Grid>
              </Grid>
            </CardContent>
          </ProfileSection>

          <ProfileSection>
            <CardContent>
              <SectionTitle>
                <SchoolIcon />
                Academic Information
              </SectionTitle>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <ProfileItem>
                    <ProfileItemLabel>Affiliation:</ProfileItemLabel>
                    <ProfileItemValue>{userProfile.affiliation || 'Not specified'}</ProfileItemValue>
                  </ProfileItem>
                </Grid>
                <Grid item xs={12} md={6}>
                  <ProfileItem>
                    <ProfileItemLabel>Country:</ProfileItemLabel>
                    <ProfileItemValue>{userProfile.country || 'Not specified'}</ProfileItemValue>
                  </ProfileItem>
                </Grid>
                <Grid item xs={12}>
                  <ProfileItem>
                    <ProfileItemLabel>ORCID ID:</ProfileItemLabel>
                    <ProfileItemValue>{userProfile.orcidId || 'Not specified'}</ProfileItemValue>
                  </ProfileItem>
                </Grid>
                <Grid item xs={12}>
                  <ProfileItem>
                    <ProfileItemLabel>Research Interests:</ProfileItemLabel>
                    <Box>
                    {userProfile.areasOfInterest && userProfile.areasOfInterest.length > 0
                    ? Array.isArray(userProfile.areasOfInterest)
                      ? userProfile.areasOfInterest.join(', ')
                      : userProfile.areasOfInterest
                      : 'Not specified'}
                    </Box>
                  </ProfileItem>
                </Grid>
              </Grid>
            </CardContent>
          </ProfileSection>
        </>
      )}

      {/* Submissions Tab */}
      {activeTab === 1 && (
        <ProfileSection>
          <CardContent sx={{ p: 0 }}>
            <Submissions isEmbedded={true} />
          </CardContent>
        </ProfileSection>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        <Button 
          variant="outlined" 
          color="primary"
          onClick={() => navigate('/')}
          sx={{ cursor: 'pointer' }}
        >
          Back to Home
        </Button>
        <Button 
          variant="outlined" 
          color="primary"
          onClick={() => navigate('/edit-profile')}
          sx={{ cursor: 'pointer' }}
        >
          Edit Profile
        </Button>
        <Button 
          variant="outlined" 
          color="primary"
          onClick={() => navigate('/titlesubmission')}
          sx={{ cursor: 'pointer' }}
        >
          Make a Submission
        </Button>
      </Box>
    </Container>
  );
} 