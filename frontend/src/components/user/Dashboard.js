import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getActiveOutages, toggleSMS } from '../../services/api';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Notifications,
  Power,
  Logout,
  Refresh,
  AccessTime,
  LocationOn,
  Warning,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import electricianImage from '../../assets/Electrition.jpg';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [outages, setOutages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(user?.sms_notifications_enabled);

  useEffect(() => {
    fetchOutages();
  }, []);

  const fetchOutages = async () => {
    try {
      const response = await getActiveOutages();
      setOutages(response.data);
    } catch (err) {
      toast.error('Failed to fetch outages');
    } finally {
      setLoading(false);
    }
  };

  const handleSMSToggle = async () => {
    try {
      await toggleSMS(user.id);
      setSmsEnabled(!smsEnabled);
      toast.success(`SMS notifications ${!smsEnabled ? 'enabled' : 'disabled'}`);
    } catch (err) {
      toast.error('Failed to update SMS settings');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          backgroundImage: `url(${electricianImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url(${electricianImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
          {/* Header Section with Title and Buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
            }}
          >
            {/* System Title */}
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              }}
            >
              <Power sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }} />
              Village Power Alert System
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Refresh />}
                onClick={fetchOutages}
                sx={{
                  minWidth: { xs: '100px', sm: '120px' },
                  height: '36px',
                  backgroundColor: 'rgba(25, 118, 210, 0.9)',
                  backdropFilter: 'blur(4px)',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 1)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                Refresh
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Logout />}
                onClick={handleLogout}
                sx={{
                  minWidth: { xs: '100px', sm: '120px' },
                  height: '36px',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                Logout
              </Button>
            </Box>
          </Box>

          {/* Welcome Card */}
          <Paper
            elevation={24}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 4,
              background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.95) 0%, rgba(100, 181, 246, 0.95) 100%)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              position: 'relative',
              overflow: 'hidden',
              color: 'white',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                gap: 2,
                py: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                    letterSpacing: '-0.5px',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    mb: 1,
                  }}
                >
                  Welcome back, {user.name} 👋
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    opacity: 0.9,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    maxWidth: '600px',
                  }}
                >
                  Stay informed about power outages in your village and manage your notification preferences
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '12px 20px',
                  borderRadius: 2,
                  backdropFilter: 'blur(5px)',
                }}
              >
                <Notifications sx={{ fontSize: '1.5rem' }} />
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    SMS Notifications
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {smsEnabled ? 'Enabled' : 'Disabled'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Main Content */}
          <Grid container spacing={3}>
            {/* Notification Settings Card */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={24}
                sx={{
                  p: { xs: 2, sm: 3 },
                  height: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Notifications color="primary" sx={{ mr: 1.5, fontSize: '1.5rem' }} />
                  <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                    Notification Settings
                  </Typography>
                </Box>
                <Box sx={{ pl: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={smsEnabled}
                        onChange={handleSMSToggle}
                        color="primary"
                      />
                    }
                    label="SMS Notifications"
                    sx={{ mb: 2 }}
                  />
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      pl: 1,
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    Receive instant SMS alerts about power outages in your village
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Outages Card */}
            <Grid item xs={12} md={8}>
              <Paper
                elevation={24}
                sx={{
                  p: { xs: 2, sm: 3 },
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Power color="primary" sx={{ mr: 1.5, fontSize: '1.5rem' }} />
                  <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                    Active Power Outages
                  </Typography>
                </Box>
                {outages.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                    >
                      No active outages in your village.
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {outages.map((outage) => (
                      <Grid item xs={12} key={outage.id}>
                        <Card
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(5px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Warning color="error" sx={{ mr: 1.5, fontSize: '1.5rem' }} />
                              <Typography
                                variant="h6"
                                color="error"
                                sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}
                              >
                                Power Outage Alert
                              </Typography>
                            </Box>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                  <LocationOn color="primary" sx={{ mr: 1.5, fontSize: '1.25rem' }} />
                                  <Typography
                                    variant="body1"
                                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                                  >
                                    {outage.village.name}
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  sx={{ pl: 4, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                >
                                  Reason: {outage.reason}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                  <AccessTime color="primary" sx={{ mr: 1.5, fontSize: '1.25rem' }} />
                                  <Typography
                                    variant="body2"
                                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                  >
                                    Started: {new Date(outage.start_time).toLocaleString()}
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  sx={{ pl: 4, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                >
                                  Expected Return: {new Date(outage.expected_return).toLocaleString()}
                                </Typography>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard; 