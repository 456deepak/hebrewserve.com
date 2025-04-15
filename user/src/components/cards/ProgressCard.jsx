import React from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Typography, 
  Paper,
  LinearProgress,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { fadeInUp } from '../../utils/animations';

// Styled components
const CardWrapper = styled(Paper)(({ theme, delay = 0, variant = 'default', color = 'primary' }) => {
  const variants = {
    default: {
      background: theme.palette.background.paper,
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
    },
    gradient: {
      background: `linear-gradient(135deg, ${theme.palette[color].dark} 0%, ${theme.palette[color].main} 100%)`,
      boxShadow: `0 8px 16px ${alpha(theme.palette[color].main, 0.3)}`
    },
    outlined: {
      background: alpha(theme.palette[color].main, 0.05),
      border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
      boxShadow: 'none'
    },
    glass: {
      background: alpha(theme.palette.background.paper, 0.7),
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }
  };

  return {
    borderRadius: 16,
    padding: theme.spacing(3),
    height: '100%',
    position: 'relative',
    opacity: 0,
    animation: `${fadeInUp} 0.6s ${delay}s forwards ease-out`,
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)'
    },
    ...variants[variant]
  };
});

const StyledLinearProgress = styled(LinearProgress)(({ theme, color = 'primary', variant = 'default' }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: variant === 'gradient' ? alpha('#fff', 0.2) : alpha(theme.palette[color].main, 0.1),
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    backgroundColor: variant === 'gradient' ? '#fff' : theme.palette[color].main
  }
}));

const StyledCircularProgress = styled(CircularProgress)(({ theme, color = 'primary', variant = 'default' }) => ({
  color: variant === 'gradient' ? '#fff' : theme.palette[color].main
}));

const ProgressCard = ({
  title,
  subtitle,
  value = 0,
  maxValue = 100,
  icon,
  progressType = 'linear',
  variant = 'default',
  color = 'primary',
  delay = 0,
  showPercentage = true,
  size = 80,
  thickness = 4,
  footer
}) => {
  const theme = useTheme();
  
  // Calculate percentage
  const percentage = Math.round((value / maxValue) * 100);
  
  // Determine text color based on variant
  const textColor = variant === 'gradient' ? 'common.white' : 
                    variant === 'outlined' ? theme.palette[color].main : 
                    'text.primary';
  
  const secondaryTextColor = variant === 'gradient' ? alpha('#fff', 0.8) : 
                             variant === 'outlined' ? alpha(theme.palette[color].main, 0.8) : 
                             'text.secondary';

  return (
    <CardWrapper elevation={variant === 'outlined' ? 0 : 2} delay={delay} variant={variant} color={color}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          {title && (
            <Typography variant="h6" color={textColor} gutterBottom>
              {title}
            </Typography>
          )}
          
          {subtitle && (
            <Typography variant="body2" color={secondaryTextColor} gutterBottom>
              {subtitle}
            </Typography>
          )}
        </Box>
        
        {icon && (
          <Box sx={{ color: variant === 'gradient' ? 'white' : theme.palette[color].main }}>
            {icon}
          </Box>
        )}
      </Box>
      
      {progressType === 'linear' ? (
        <Box sx={{ mt: 2, mb: 1 }}>
          <StyledLinearProgress 
            variant="determinate" 
            value={percentage} 
            color={color}
            variant={variant}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" color={secondaryTextColor}>
              {value} / {maxValue}
            </Typography>
            
            {showPercentage && (
              <Typography variant="body2" color={secondaryTextColor} fontWeight="bold">
                {percentage}%
              </Typography>
            )}
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2, position: 'relative' }}>
          <StyledCircularProgress 
            variant="determinate" 
            value={percentage} 
            size={size} 
            thickness={thickness}
            color={color}
            variant={variant}
          />
          
          <Box
            sx={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="h6" color={textColor} fontWeight="bold">
              {percentage}%
            </Typography>
            
            <Typography variant="caption" color={secondaryTextColor}>
              {value} / {maxValue}
            </Typography>
          </Box>
        </Box>
      )}
      
      {footer && (
        <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${variant === 'gradient' ? alpha('#fff', 0.1) : theme.palette.divider}` }}>
          {footer}
        </Box>
      )}
    </CardWrapper>
  );
};

ProgressCard.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  value: PropTypes.number,
  maxValue: PropTypes.number,
  icon: PropTypes.node,
  progressType: PropTypes.oneOf(['linear', 'circular']),
  variant: PropTypes.oneOf(['default', 'gradient', 'outlined', 'glass']),
  color: PropTypes.string,
  delay: PropTypes.number,
  showPercentage: PropTypes.bool,
  size: PropTypes.number,
  thickness: PropTypes.number,
  footer: PropTypes.node
};

export default ProgressCard;
