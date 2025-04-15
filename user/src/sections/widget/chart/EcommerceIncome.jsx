import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import ListItemButton from '@mui/material/ListItemButton';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import ReactApexChart from 'react-apexcharts';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import MoreIcon from 'components/@extended/MoreIcon';
import { ThemeMode } from 'config';

// assets
import { DollarCircle } from 'iconsax-react';

// ==============================|| CHART  ||============================== //

function EcommerceDataChart({count}) {
  const theme = useTheme();
  const mode = theme.palette.mode;

  // chart options
  const areaChartOptions = {
    chart: {
      id: 'new-stack-chart',
      type: 'bar',
      sparkline: {
        enabled: true
      },
      toolbar: {
        show: false
      },
      offsetX: -4
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      bar: {
        columnWidth: '80%'
      }
    },
    xaxis: {
      crosshairs: {
        width: 1
      }
    },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      }
    }
  };

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.success.main],
      theme: {
        mode: mode === ThemeMode.DARK ? 'dark' : 'light'
      }
    }));
  }, [mode, primary, secondary, line, theme]);

  const [series, setSeries] = useState([
    {
      name: 'RBM',
      data: []
    }
  ]);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (count) {
       
     
  
        const generatedData = Array.from({ length: 100 }, () => Math.floor(Math.random() * count)); // Generate 12 random values from 0 to count
  
        setSeries([
          {
            name: 'RBM',
            data: generatedData
          }
        ]);
      }
    };
  
    fetchUserData();
  }, [count]);
  

  return <ReactApexChart options={options} series={series} type="bar" height={80} />;
}

// ==============================|| CHART WIDGET - ECOMMERCE INCOME  ||============================== //

export default function EcommerceIncome({count}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <MainCard>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Avatar variant="rounded" color="secondary" sx={{ color: 'text.secondary' }}>
              <DollarCircle />
            </Avatar>
            <IconButton
              color="secondary"
              id="wallet-button"
              aria-controls={open ? 'wallet-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              {/* <MoreIcon /> */}
            </IconButton>
            {/* <Menu
              id="wallet-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'wallet-button',
                sx: { p: 1.25, minWidth: 150 }
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
            >

            </Menu> */}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack>
            <Typography variant="subtitle1">{count} RBM</Typography>
            <Typography variant="caption">Total Buy ICO</Typography>
          </Stack>
          <EcommerceDataChart count={count} />
        </Grid>
      </Grid>
    </MainCard>
  );
}
