import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getOutages, resolveOutage, createOutage } from '../../services/api';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [outages, setOutages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newOutage, setNewOutage] = useState({
    village: '',
    reason: '',
    duration_hours: 2,
    severity: 'medium',
    affected_areas: '',
  });

  useEffect(() => {
    fetchOutages();
  }, []);

  const fetchOutages = async () => {
    try {
      const response = await getOutages();
      setOutages(response.data);
    } catch (err) {
      toast.error('Failed to fetch outages');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOutage = async () => {
    try {
      await createOutage(newOutage);
      setOpenDialog(false);
      fetchOutages();
      toast.success('Outage reported successfully');
    } catch (err) {
      toast.error('Failed to create outage');
    }
  };

  const handleResolveOutage = async (id) => {
    try {
      await resolveOutage(id);
      fetchOutages();
      toast.success('Outage resolved successfully');
    } catch (err) {
      toast.error('Failed to resolve outage');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4">
                Employee Dashboard
              </Typography>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenDialog(true)}
                  sx={{ mr: 2 }}
                >
                  Report New Outage
                </Button>
                <Button variant="outlined" color="primary" onClick={handleLogout}>
                  Logout
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                All Power Outages
              </Typography>
              {outages.length === 0 ? (
                <Typography>No active outages.</Typography>
              ) : (
                <Grid container spacing={2}>
                  {outages.map((outage) => (
                    <Grid item xs={12} md={6} key={outage.id}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {outage.village.name}
                          </Typography>
                          <Typography color="textSecondary" gutterBottom>
                            Reason: {outage.reason}
                          </Typography>
                          <Typography color="textSecondary" gutterBottom>
                            Started: {new Date(outage.start_time).toLocaleString()}
                          </Typography>
                          <Typography color="textSecondary" gutterBottom>
                            Expected Return: {new Date(outage.expected_return).toLocaleString()}
                          </Typography>
                          <Typography color="textSecondary" gutterBottom>
                            Severity: {outage.severity}
                          </Typography>
                          {!outage.is_resolved && (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleResolveOutage(outage.id)}
                              sx={{ mt: 2 }}
                            >
                              Resolve Outage
                            </Button>
                          )}
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Report New Outage</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Reason"
            value={newOutage.reason}
            onChange={(e) => setNewOutage({ ...newOutage, reason: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Duration (hours)"
            type="number"
            value={newOutage.duration_hours}
            onChange={(e) => setNewOutage({ ...newOutage, duration_hours: e.target.value })}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Severity</InputLabel>
            <Select
              value={newOutage.severity}
              onChange={(e) => setNewOutage({ ...newOutage, severity: e.target.value })}
              label="Severity"
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Affected Areas"
            value={newOutage.affected_areas}
            onChange={(e) => setNewOutage({ ...newOutage, affected_areas: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateOutage} variant="contained" color="primary">
            Report
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard; 