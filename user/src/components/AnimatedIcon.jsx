import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

// animations
import { 
  pulse, 
  bounce, 
  rotate, 
  fadeIn, 
  fadeInUp, 
  fadeInDown, 
  fadeInLeft, 
  fadeInRight 
} from 'utils/animations';

// Styled component for animated icons
const AnimatedIconWrapper = styled(Box)(({ 
  theme, 
  animation = 'none',
  duration = 2,
  delay = 0,
  infinite = false,
  hover = false
}) => {
  // Base animation style
  const getAnimationStyle = () => {
    const infiniteStyle = infinite ? 'infinite' : 'forwards';
    
    switch (animation) {
      case 'pulse':
        return {
          animation: `${pulse} ${duration}s ${delay}s ${infiniteStyle} ease-in-out`
        };
      case 'bounce':
        return {
          animation: `${bounce} ${duration}s ${delay}s ${infiniteStyle} ease-in-out`
        };
      case 'rotate':
        return {
          animation: `${rotate} ${duration}s ${delay}s ${infiniteStyle} linear`
        };
      case 'fadeIn':
        return {
          opacity: 0,
          animation: `${fadeIn} ${duration}s ${delay}s ${infiniteStyle} ease-out`
        };
      case 'fadeInUp':
        return {
          opacity: 0,
          transform: 'translateY(20px)',
          animation: `${fadeInUp} ${duration}s ${delay}s ${infiniteStyle} ease-out`
        };
      case 'fadeInDown':
        return {
          opacity: 0,
          transform: 'translateY(-20px)',
          animation: `${fadeInDown} ${duration}s ${delay}s ${infiniteStyle} ease-out`
        };
      case 'fadeInLeft':
        return {
          opacity: 0,
          transform: 'translateX(-20px)',
          animation: `${fadeInLeft} ${duration}s ${delay}s ${infiniteStyle} ease-out`
        };
      case 'fadeInRight':
        return {
          opacity: 0,
          transform: 'translateX(20px)',
          animation: `${fadeInRight} ${duration}s ${delay}s ${infiniteStyle} ease-out`
        };
      default:
        return {};
    }
  };

  // Hover animation style
  const getHoverStyle = () => {
    if (!hover) return {};

    switch (animation) {
      case 'pulse':
        return {
          '&:hover': {
            animation: `${pulse} ${duration}s ease-in-out`
          }
        };
      case 'bounce':
        return {
          '&:hover': {
            animation: `${bounce} ${duration}s ease-in-out`
          }
        };
      case 'rotate':
        return {
          '&:hover': {
            animation: `${rotate} ${duration}s linear`
          }
        };
      default:
        return {};
    }
  };

  return {
    display: 'inline-flex',
    ...(hover ? {} : getAnimationStyle()),
    ...getHoverStyle()
  };
});

// ==============================|| ANIMATED ICON ||============================== //

export default function AnimatedIcon({ 
  children, 
  animation = 'none',
  duration = 2,
  delay = 0,
  infinite = false,
  hover = false,
  sx = {},
  ...others 
}) {
  return (
    <AnimatedIconWrapper
      animation={animation}
      duration={duration}
      delay={delay}
      infinite={infinite}
      hover={hover}
      sx={sx}
      {...others}
    >
      {children}
    </AnimatedIconWrapper>
  );
}

AnimatedIcon.propTypes = {
  children: PropTypes.node,
  animation: PropTypes.oneOf([
    'none', 
    'pulse', 
    'bounce', 
    'rotate', 
    'fadeIn', 
    'fadeInUp', 
    'fadeInDown', 
    'fadeInLeft', 
    'fadeInRight'
  ]),
  duration: PropTypes.number,
  delay: PropTypes.number,
  infinite: PropTypes.bool,
  hover: PropTypes.bool,
  sx: PropTypes.object
};
