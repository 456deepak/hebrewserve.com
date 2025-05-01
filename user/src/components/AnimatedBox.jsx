import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

// animations
import { 
  fadeIn, 
  fadeInUp, 
  fadeInDown, 
  fadeInLeft, 
  fadeInRight,
  pulse,
  bounce
} from 'utils/animations';

// Styled component for animated box
const StyledAnimatedBox = styled(Box)(({ 
  theme, 
  animation = 'fadeIn',
  duration = 0.6,
  delay = 0,
  infinite = false
}) => {
  // Animation style based on the animation prop
  const getAnimationStyle = () => {
    const infiniteStyle = infinite ? 'infinite' : 'forwards';
    
    switch (animation) {
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
      case 'pulse':
        return {
          animation: `${pulse} ${duration}s ${delay}s ${infiniteStyle} ease-in-out`
        };
      case 'bounce':
        return {
          animation: `${bounce} ${duration}s ${delay}s ${infiniteStyle} ease-in-out`
        };
      default:
        return {};
    }
  };

  return {
    ...getAnimationStyle()
  };
});

// ==============================|| ANIMATED BOX ||============================== //

export default function AnimatedBox({ 
  children, 
  animation = 'fadeIn',
  duration = 0.6,
  delay = 0,
  infinite = false,
  sx = {},
  ...others 
}) {
  return (
    <StyledAnimatedBox
      animation={animation}
      duration={duration}
      delay={delay}
      infinite={infinite}
      sx={sx}
      {...others}
    >
      {children}
    </StyledAnimatedBox>
  );
}

AnimatedBox.propTypes = {
  children: PropTypes.node,
  animation: PropTypes.oneOf(['fadeIn', 'fadeInUp', 'fadeInDown', 'fadeInLeft', 'fadeInRight', 'pulse', 'bounce']),
  duration: PropTypes.number,
  delay: PropTypes.number,
  infinite: PropTypes.bool,
  sx: PropTypes.object
};
