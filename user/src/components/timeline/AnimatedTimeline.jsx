import React from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Typography, 
  Paper,
  useTheme,
  alpha,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { fadeIn } from '../../utils/animations';

// Styled components
const TimelineWrapper = styled(Paper)(({ theme, delay = 0 }) => ({
  borderRadius: 16,
  padding: theme.spacing(3),
  opacity: 0,
  animation: `${fadeIn} 0.6s ${delay}s forwards ease-out`,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
}));

const TimelineHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3)
}));

const TimelineContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 20,
    width: 2,
    backgroundColor: alpha(theme.palette.divider, 0.5),
    zIndex: 0
  }
}));

const TimelineItem = styled(Box)(({ theme, index = 0 }) => ({
  position: 'relative',
  paddingLeft: theme.spacing(5),
  paddingBottom: theme.spacing(3),
  opacity: 0,
  animation: `${fadeIn} 0.5s ${0.2 + (index * 0.1)}s forwards ease-out`,
  '&:last-child': {
    paddingBottom: 0
  }
}));

const TimelineDot = styled(Avatar)(({ theme, color = 'primary', variant = 'filled' }) => {
  const variants = {
    filled: {
      backgroundColor: theme.palette[color].main,
      color: theme.palette[color].contrastText
    },
    outlined: {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette[color].main,
      border: `2px solid ${theme.palette[color].main}`
    },
    light: {
      backgroundColor: alpha(theme.palette[color].main, 0.2),
      color: theme.palette[color].main
    }
  };

  return {
    width: 40,
    height: 40,
    position: 'absolute',
    left: 0,
    top: 0,
    transform: 'translateX(-50%)',
    zIndex: 1,
    ...variants[variant]
  };
});

const TimelineContent = styled(Box)(({ theme, color = 'primary', variant = 'default' }) => {
  const variants = {
    default: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
    },
    outlined: {
      backgroundColor: theme.palette.background.paper,
      border: `1px solid ${alpha(theme.palette[color].main, 0.3)}`,
      boxShadow: 'none'
    },
    filled: {
      backgroundColor: alpha(theme.palette[color].main, 0.1),
      boxShadow: 'none'
    }
  };

  return {
    borderRadius: 12,
    padding: theme.spacing(2),
    ...variants[variant]
  };
});

const AnimatedTimeline = ({
  title,
  items = [],
  variant = 'default',
  delay = 0
}) => {
  const theme = useTheme();

  return (
    <TimelineWrapper elevation={0} delay={delay}>
      {title && (
        <TimelineHeader>
          <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </TimelineHeader>
      )}
      
      <TimelineContainer>
        {items.map((item, index) => (
          <TimelineItem key={index} index={index}>
            <TimelineDot 
              color={item.color || 'primary'} 
              variant={item.dotVariant || 'filled'}
            >
              {item.icon}
            </TimelineDot>
            
            <TimelineContent 
              color={item.color || 'primary'} 
              variant={item.contentVariant || variant}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 600 }}>
                  {item.title}
                </Typography>
                
                {item.date && (
                  <Typography variant="caption" color="text.secondary">
                    {item.date}
                  </Typography>
                )}
              </Box>
              
              {item.description && (
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              )}
              
              {item.content && (
                <Box sx={{ mt: 1 }}>
                  {item.content}
                </Box>
              )}
            </TimelineContent>
          </TimelineItem>
        ))}
      </TimelineContainer>
    </TimelineWrapper>
  );
};

AnimatedTimeline.propTypes = {
  title: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      date: PropTypes.string,
      icon: PropTypes.node,
      color: PropTypes.string,
      dotVariant: PropTypes.oneOf(['filled', 'outlined', 'light']),
      contentVariant: PropTypes.oneOf(['default', 'outlined', 'filled']),
      content: PropTypes.node
    })
  ),
  variant: PropTypes.oneOf(['default', 'outlined', 'filled']),
  delay: PropTypes.number
};

export default AnimatedTimeline;
