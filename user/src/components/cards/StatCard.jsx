import React from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Typography, 
  Paper,
  Avatar,
  useTheme,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { fadeInUp } from '../../utils/animations';
import AnimatedCounter from '../animated/AnimatedCounter';

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

const IconWrapper = styled(Avatar)(({ theme, color = 'primary', variant = 'default' }) => {
  const variants = {
    default: {
      backgroundColor: alpha(theme.palette[color].main, 0.1),
      color: theme.palette[color].main
    },
    filled: {
      backgroundColor: theme.palette[color].main,
      color: theme.palette[color].contrastText
    },
    outlined: {
      backgroundColor: 'transparent',
      color: theme.palette[color].main,
      border: `2px solid ${theme.palette[color].main}`
    },
    gradient: {
      background: `linear-gradient(135deg, ${theme.palette[color].main} 0%, ${theme.palette[color].light} 100%)`,
      color: theme.palette[color].contrastText
    }
  };

  return {
    width: 56,
    height: 56,
    ...variants[variant]
  };
});

const StatCard = ({
  title,
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  icon,
  description,
  color = 'primary',
  variant = 'default',
  iconVariant = 'default',
  delay = 0,
  animate = true
}) => {
  const theme = useTheme();
  
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
          <Typography variant="body2" color={secondaryTextColor} gutterBottom>
            {title}
          </Typography>
          
          {animate ? (
            <AnimatedCounter
              start={0}
              end={parseFloat(value)}
              prefix={prefix}
              suffix={suffix}
              decimals={decimals}
              duration={2000}
              delay={delay + 0.3}
              variant="h3"
              color={textColor}
              sx={{ fontWeight: 700 }}
            />
          ) : (
            <Typography variant="h3" color={textColor} sx={{ fontWeight: 700 }}>
              {prefix}{parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
            </Typography>
          )}
        </Box>
        
        {icon && (
          <IconWrapper color={color} variant={iconVariant}>
            {icon}
          </IconWrapper>
        )}
      </Box>
      
      {description && (
        <Typography variant="body2" color={secondaryTextColor}>
          {description}
        </Typography>
      )}
    </CardWrapper>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  decimals: PropTypes.number,
  icon: PropTypes.node,
  description: PropTypes.string,
  color: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'gradient', 'outlined', 'glass']),
  iconVariant: PropTypes.oneOf(['default', 'filled', 'outlined', 'gradient']),
  delay: PropTypes.number,
  animate: PropTypes.bool
};

export default StatCard;
