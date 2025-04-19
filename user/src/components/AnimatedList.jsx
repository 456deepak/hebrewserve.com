import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

// animations
import { fadeIn, fadeInUp, fadeInDown, fadeInLeft, fadeInRight } from 'utils/animations';

// Styled component for animated list items
const AnimatedListItem = styled(Box)(({ 
  theme, 
  animation = 'fadeIn',
  duration = 0.5,
  delay = 0,
  index = 0,
  staggerDelay = 0.1
}) => {
  // Calculate the total delay based on index and stagger delay
  const totalDelay = delay + (index * staggerDelay);
  
  // Animation styles
  const getAnimationStyle = () => {
    switch (animation) {
      case 'fadeIn':
        return {
          opacity: 0,
          animation: `${fadeIn} ${duration}s ${totalDelay}s forwards ease-out`
        };
      case 'fadeInUp':
        return {
          opacity: 0,
          transform: 'translateY(20px)',
          animation: `${fadeInUp} ${duration}s ${totalDelay}s forwards ease-out`
        };
      case 'fadeInDown':
        return {
          opacity: 0,
          transform: 'translateY(-20px)',
          animation: `${fadeInDown} ${duration}s ${totalDelay}s forwards ease-out`
        };
      case 'fadeInLeft':
        return {
          opacity: 0,
          transform: 'translateX(-20px)',
          animation: `${fadeInLeft} ${duration}s ${totalDelay}s forwards ease-out`
        };
      case 'fadeInRight':
        return {
          opacity: 0,
          transform: 'translateX(20px)',
          animation: `${fadeInRight} ${duration}s ${totalDelay}s forwards ease-out`
        };
      default:
        return {};
    }
  };

  return {
    ...getAnimationStyle()
  };
});

// ==============================|| ANIMATED LIST ||============================== //

export default function AnimatedList({ 
  children, 
  animation = 'fadeInUp',
  duration = 0.5,
  initialDelay = 0,
  staggerDelay = 0.1,
  sx = {},
  ...others 
}) {
  // Clone children and add animation props
  const animatedChildren = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;
    
    return (
      <AnimatedListItem
        animation={animation}
        duration={duration}
        delay={initialDelay}
        index={index}
        staggerDelay={staggerDelay}
      >
        {child}
      </AnimatedListItem>
    );
  });

  return (
    <Box sx={sx} {...others}>
      {animatedChildren}
    </Box>
  );
}

AnimatedList.propTypes = {
  children: PropTypes.node,
  animation: PropTypes.oneOf(['fadeIn', 'fadeInUp', 'fadeInDown', 'fadeInLeft', 'fadeInRight']),
  duration: PropTypes.number,
  initialDelay: PropTypes.number,
  staggerDelay: PropTypes.number,
  sx: PropTypes.object
};
