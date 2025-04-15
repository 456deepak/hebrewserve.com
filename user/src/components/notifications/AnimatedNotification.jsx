import React from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Typography, 
  Paper,
  IconButton,
  Avatar,
  useTheme,
  alpha,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { fadeInRight, fadeOut } from '../../utils/animations';
import { CloseCircle } from 'iconsax-react';

// Styled components
const NotificationWrapper = styled(Paper)(({ theme, delay = 0, variant = 'default', color = 'primary', closing }) => {
  const variants = {
    default: {
      background: theme.palette.background.paper,
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
    },
    colored: {
      background: theme.palette[color].main,
      color: theme.palette[color].contrastText,
      boxShadow: `0 8px 16px ${alpha(theme.palette[color].main, 0.3)}`
    },
    outlined: {
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette[color].main}`,
      boxShadow: 'none'
    },
    subtle: {
      background: alpha(theme.palette[color].main, 0.1),
      boxShadow: 'none'
    }
  };

  return {
    borderRadius: 12,
    padding: theme.spacing(2),
    position: 'relative',
    opacity: 0,
    animation: closing 
      ? `${fadeOut} 0.3s forwards ease-out`
      : `${fadeInRight} 0.4s ${delay}s forwards ease-out`,
    ...variants[variant]
  };
});

const IconWrapper = styled(Avatar)(({ theme, color = 'primary', variant = 'default' }) => {
  const variants = {
    default: {
      backgroundColor: alpha(theme.palette[color].main, 0.1),
      color: theme.palette[color].main
    },
    colored: {
      backgroundColor: alpha('#fff', 0.2),
      color: '#fff'
    },
    outlined: {
      backgroundColor: alpha(theme.palette[color].main, 0.1),
      color: theme.palette[color].main
    },
    subtle: {
      backgroundColor: theme.palette[color].main,
      color: theme.palette[color].contrastText
    }
  };

  return {
    width: 40,
    height: 40,
    ...variants[variant]
  };
});

const AnimatedNotification = ({
  title,
  message,
  icon,
  variant = 'default',
  color = 'primary',
  delay = 0,
  onClose,
  action,
  closing = false
}) => {
  const theme = useTheme();
  
  // Determine text colors based on variant
  const titleColor = variant === 'colored' ? 'inherit' : 
                     variant === 'outlined' || variant === 'subtle' ? theme.palette[color].main : 
                     'text.primary';
  
  const messageColor = variant === 'colored' ? 'inherit' : 
                       variant === 'outlined' || variant === 'subtle' ? alpha(theme.palette[color].main, 0.8) : 
                       'text.secondary';

  return (
    <NotificationWrapper 
      elevation={variant === 'outlined' || variant === 'subtle' ? 0 : 3} 
      delay={delay} 
      variant={variant} 
      color={color}
      closing={closing}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        {icon && (
          <IconWrapper color={color} variant={variant} sx={{ mr: 2 }}>
            {icon}
          </IconWrapper>
        )}
        
        <Box sx={{ flex: 1 }}>
          {title && (
            <Typography variant="subtitle1" color={titleColor} sx={{ fontWeight: 600, mb: 0.5 }}>
              {title}
            </Typography>
          )}
          
          {message && (
            <Typography variant="body2" color={messageColor}>
              {message}
            </Typography>
          )}
          
          {action && (
            <Box sx={{ mt: 2 }}>
              <Button
                size="small"
                variant={variant === 'colored' ? 'outlined' : 'contained'}
                color={variant === 'colored' ? 'inherit' : color}
                onClick={action.onClick}
                sx={{
                  ...(variant === 'colored' && {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  })
                }}
              >
                {action.label}
              </Button>
            </Box>
          )}
        </Box>
        
        {onClose && (
          <IconButton 
            size="small" 
            onClick={onClose}
            sx={{ 
              ml: 1, 
              color: variant === 'colored' ? 'inherit' : 'text.secondary',
              '&:hover': {
                backgroundColor: variant === 'colored' 
                  ? alpha('#fff', 0.1) 
                  : alpha(theme.palette.text.primary, 0.1)
              }
            }}
          >
            <CloseCircle size={20} />
          </IconButton>
        )}
      </Box>
    </NotificationWrapper>
  );
};

AnimatedNotification.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  icon: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'colored', 'outlined', 'subtle']),
  color: PropTypes.string,
  delay: PropTypes.number,
  onClose: PropTypes.func,
  action: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  }),
  closing: PropTypes.bool
};

export default AnimatedNotification;
