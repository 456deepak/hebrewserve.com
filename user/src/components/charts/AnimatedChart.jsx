import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Typography, 
  Paper,
  useTheme,
  alpha,
  CircularProgress,
  Skeleton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { fadeIn } from '../../utils/animations';
import ReactApexChart from 'react-apexcharts';

// Styled components
const ChartWrapper = styled(Paper)(({ theme, delay = 0 }) => ({
  borderRadius: 16,
  padding: theme.spacing(3),
  height: '100%',
  opacity: 0,
  animation: `${fadeIn} 0.6s ${delay}s forwards ease-out`,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  display: 'flex',
  flexDirection: 'column'
}));

const ChartHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3)
}));

const ChartContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 200
}));

const AnimatedChart = ({
  title,
  subtitle,
  type = 'line',
  series = [],
  options = {},
  height = 350,
  loading = false,
  delay = 0,
  animate = true,
  headerRight
}) => {
  const theme = useTheme();
  const [isClient, setIsClient] = useState(false);
  const [chartOptions, setChartOptions] = useState({});
  
  // Set isClient to true when component mounts (for SSR compatibility)
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Merge default options with provided options
  useEffect(() => {
    const defaultOptions = {
      chart: {
        type,
        toolbar: {
          show: false
        },
        animations: {
          enabled: animate,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        },
        background: 'transparent',
        fontFamily: theme.typography.fontFamily
      },
      colors: [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.success.main,
        theme.palette.warning.main,
        theme.palette.error.main,
        theme.palette.info.main
      ],
      grid: {
        borderColor: alpha(theme.palette.divider, 0.1),
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      tooltip: {
        theme: theme.palette.mode
      },
      xaxis: {
        labels: {
          style: {
            colors: theme.palette.text.secondary
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: theme.palette.text.secondary
          }
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        labels: {
          colors: theme.palette.text.primary
        }
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      dataLabels: {
        enabled: false
      }
    };
    
    setChartOptions({ ...defaultOptions, ...options });
  }, [options, theme, type, animate]);

  return (
    <ChartWrapper elevation={0} delay={delay}>
      <ChartHeader>
        <Box>
          {title && (
            <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          )}
          
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        
        {headerRight && (
          <Box>
            {headerRight}
          </Box>
        )}
      </ChartHeader>
      
      <ChartContainer>
        {loading ? (
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircularProgress size={40} thickness={4} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Loading chart data...
            </Typography>
          </Box>
        ) : !isClient ? (
          <Skeleton variant="rectangular" width="100%" height={height} animation="wave" />
        ) : (
          <ReactApexChart
            options={chartOptions}
            series={series}
            type={type}
            height={height}
            width="100%"
          />
        )}
      </ChartContainer>
    </ChartWrapper>
  );
};

AnimatedChart.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  type: PropTypes.oneOf([
    'line', 'area', 'bar', 'pie', 'donut', 'radialBar', 
    'scatter', 'bubble', 'heatmap', 'candlestick', 'radar'
  ]),
  series: PropTypes.array,
  options: PropTypes.object,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  loading: PropTypes.bool,
  delay: PropTypes.number,
  animate: PropTypes.bool,
  headerRight: PropTypes.node
};

export default AnimatedChart;
