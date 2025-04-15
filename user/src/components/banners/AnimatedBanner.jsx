import React from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Typography, 
  Paper,
  Button,
  useTheme,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { fadeIn, gradientShift } from '../../utils/animations';

// Styled components
const BannerWrapper = styled(Paper)(({ theme, delay = 0, variant = 'default', color = 'primary' }) => {
  const variants = {
    default: {
      background: theme.palette.background.paper,
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
    },
    gradient: {
      background: `linear-gradient(135deg, ${theme.palette[color].dark} 0%, ${theme.palette[color].main} 100%)`,
      backgroundSize: '200% 200%',
      animation: `${gradientShift} 15s ease infinite`,
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
    position: 'relative',
    overflow: 'hidden',
    opacity: 0,
    animation: `${fadeIn} 0.6s ${delay}s forwards ease-out`,
    ...variants[variant]
  };
});

const BackgroundPattern = styled(Box)(({ theme, pattern }) => {
  if (!pattern) return {};
  
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(${pattern})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.05,
    zIndex: 0
  };
});

const ContentWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2)
  }
}));

const TextContent = styled(Box)(({ theme }) => ({
  flex: 1
}));

const ActionContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    width: '100%'
  }
}));

const AnimatedBanner = ({
  title,
  description,
  primaryAction,
  secondaryAction,
  icon,
  variant = 'default',
  color = 'primary',
  pattern = null,
  delay = 0,
  fullWidth = false
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
    <BannerWrapper elevation={variant === 'outlined' ? 0 : 3} delay={delay} variant={variant} color={color}>
      {pattern && <BackgroundPattern pattern={pattern} />}
      
      <ContentWrapper>
        {icon && (
          <Box sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
            {icon}
          </Box>
        )}
        
        <TextContent>
          {title && (
            <Typography variant="h5" color={textColor} gutterBottom sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          )}
          
          {description && (
            <Typography variant="body1" color={secondaryTextColor}>
              {description}
            </Typography>
          )}
        </TextContent>
        
        {(primaryAction || secondaryAction) && (
          <ActionContent>
            {secondaryAction && (
              <Button
                variant={variant === 'gradient' ? 'outlined' : 'text'}
                color={variant === 'gradient' ? 'inherit' : color}
                onClick={secondaryAction.onClick}
                sx={{ 
                  whiteSpace: 'nowrap',
                  ...(variant === 'gradient' && {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }),
                  ...(fullWidth && { flex: 1 })
                }}
              >
                {secondaryAction.label}
              </Button>
            )}
            
            {primaryAction && (
              <Button
                variant={variant === 'gradient' ? 'contained' : 'contained'}
                color={variant === 'gradient' ? 'inherit' : color}
                onClick={primaryAction.onClick}
                sx={{ 
                  whiteSpace: 'nowrap',
                  ...(variant === 'gradient' && {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)'
                    }
                  }),
                  ...(fullWidth && { flex: 1 })
                }}
              >
                {primaryAction.label}
              </Button>
            )}
          </ActionContent>
        )}
      </ContentWrapper>
    </BannerWrapper>
  );
};

AnimatedBanner.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  primaryAction: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  }),
  secondaryAction: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  }),
  icon: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'gradient', 'outlined', 'glass']),
  color: PropTypes.string,
  pattern: PropTypes.string,
  delay: PropTypes.number,
  fullWidth: PropTypes.bool
};

export default AnimatedBanner;
