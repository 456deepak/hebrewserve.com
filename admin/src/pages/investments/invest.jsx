import { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Alert,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { openSnackbar } from 'api/snackbar';
import axios from 'utils/axios';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

export default function AdminInvestmentPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planData, setPlanData] = useState({
    title: '',
    amount_from: '',
    amount_to: '',
    percentage: '',
    days: '',
    frequency_in_days: 1,
    type: 0,
    status: true,
    extra: {},
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/get-all-investment-plans');
      if (res.data.status) {
        setPlans(res.data.result);
      }
    } catch (error) {
      openSnackbar('Failed to load plans', 'error');
    }
    setLoading(false);
  };

  const handleDialogOpen = (plan = null) => {
    setEditingPlan(plan);
    setPlanData(
      plan || {
        title: '',
        amount_from: '',
        amount_to: '',
        percentage: '',
        days: '',
        frequency_in_days: 1,
        type: 0,
        status: true,
        extra: {},
      }
    );
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditingPlan(null);
  };

  const handleInputChange = (e) => {
    setPlanData({ ...planData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setPlanData({ ...planData, [e.target.name]: e.target.checked });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (editingPlan) {
        // Update Plan
        await axios.put(`/update-investment-plan/${editingPlan._id}`, planData);
        openSnackbar('Plan updated successfully', 'success');
      } else {
        // Add New Plan
        await axios.post('/add-investment-plan', planData);
        openSnackbar('Plan added successfully', 'success');
      }
      fetchPlans();
      handleDialogClose();
    } catch (error) {
      openSnackbar('Failed to save plan', 'error');
    }
    setLoading(false);
  };

  const handleDelete = async (planId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this plan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          await axios.delete(`/delete-investment-plan/${planId}`);
          openSnackbar('Plan deleted successfully', 'success');
          fetchPlans();
        } catch (error) {
          openSnackbar('Failed to delete plan', 'error');
        }
        setLoading(false);
      }
    });
  };

  const getCardColor = (percentage) => {
    if (percentage < 10) return '#FF7043';
    if (percentage < 15) return '#FFB74D';
    return '#4CAF50';
  };

  return (
    <>
      {loading && <Loader />}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <MainCard title="Investment Plans">
              <Button
                variant="contained"
                color="primary"
                sx={{ marginBottom: '16px' }}
                onClick={() => handleDialogOpen()}
              >
                Add New Plan
              </Button>
              {plans.length === 0 ? (
                <Alert severity="info" sx={{ fontSize: '1.2rem', color: '#2196F3' }}>
                  No Investment Plans Found.
                </Alert>
              ) : (
                <Grid container spacing={3}>
                  {plans.map((plan, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                      >
                        <Card
                          elevation={6}
                          sx={{
                            borderRadius: '12px',
                            backgroundColor: getCardColor(plan.percentage),
                            color: '#fff',
                            padding: '16px',
                          }}
                        >
                          <CardContent>
                            <Typography variant="h6" fontWeight="bold" color="#fff">
                              Plan Title: {plan.title}
                            </Typography>
                            <Typography variant="body1" color="#fff">
                              <strong>Amount Range:</strong> ${plan.amount_from} - ${plan.amount_to}
                            </Typography>
                            <Typography variant="body1" color="#fff">
                              <strong>ROI Percentage:</strong> {plan.percentage}%
                            </Typography>
                            <Typography variant="body1" color="#fff">
                              <strong>Duration:</strong> {plan.days} Days
                            </Typography>
                            <Typography variant="body1" color="#fff">
                              <strong>Frequency:</strong> Every {plan.frequency_in_days} Days
                            </Typography>
                          </CardContent>
                          <CardActions>
                            <Button
                              variant="outlined"
                              color="inherit"
                              onClick={() => handleDialogOpen(plan)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleDelete(plan.id)}
                            >
                              Delete
                            </Button>
                          </CardActions>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              )}
            </MainCard>
          </motion.div>
        </Grid>
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingPlan ? 'Edit Plan' : 'Add New Plan'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            name="title"
            value={planData.title}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Amount From"
            type="number"
            fullWidth
            name="amount_from"
            value={planData.amount_from}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Amount To"
            type="number"
            fullWidth
            name="amount_to"
            value={planData.amount_to}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Percentage"
            type="number"
            fullWidth
            name="percentage"
            value={planData.percentage}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Days"
            type="number"
            fullWidth
            name="days"
            value={planData.days}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Frequency (Days)"
            type="number"
            fullWidth
            name="frequency_in_days"
            value={planData.frequency_in_days}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Type"
            type="number"
            fullWidth
            name="type"
            value={planData.type}
            onChange={handleInputChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={planData.status}
                onChange={handleCheckboxChange}
                name="status"
                color="primary"
              />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
