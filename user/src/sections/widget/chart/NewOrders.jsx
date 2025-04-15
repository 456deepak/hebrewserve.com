import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// project-imports
import EcommerceDataChart from './EcommerceDataChart';
import MainCard from 'components/MainCard';

// assets
import { ArrowUp } from 'iconsax-react';

// ==============================|| CHART WIDGETS - NEW ORDER ||============================== //

export default function NewOrders({ 
  count, 
  value, 
  subtitle, 
  increment = 0, 
  isPercentage = false,
  secondaryCount,
  darkMode = false 
}) {
  const theme = useTheme();

  const [age, setAge] = useState('30');
  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <MainCard
      sx={{
        bgcolor: darkMode ? 'grey.900' : 'background.paper',
        border: '1px solid',
        borderColor: darkMode ? 'grey.800' : 'divider',
        borderRadius: 2,
        '&:hover': {
          boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.1)',
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease-in-out'
        }
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <Typography variant="h6" color={darkMode ? 'grey.400' : 'text.secondary'}>
              {value}
            </Typography>
            <Typography variant="h3" color={darkMode ? 'common.white' : 'text.primary'}>
              {isPercentage ? `${count}%` : count}
            </Typography>
            {secondaryCount && (
              <Typography variant="h4" color={darkMode ? 'grey.400' : 'text.secondary'}>
                {secondaryCount}
              </Typography>
            )}
            {/* <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle2" color={darkMode ? 'grey.500' : 'text.secondary'}>
                {subtitle}
              </Typography>
              {increment !== 0 && (
                <Typography
                  variant="subtitle2"
                  color={increment > 0 ? 'success.main' : 'error.main'}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  {increment > 0 ? '+' : ''}{increment}
                </Typography>
              )}
            </Stack> */}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          {/* <Box sx={{ opacity: 0.5 }}> */}
            {/* <EcommerceDataChart 
              count={count} 
              color={darkMode ? theme.palette.primary.main : theme.palette.primary.light} 
            /> */}
          {/* </Box> */}
        </Grid>
      </Grid>
    </MainCard>
  );
}
