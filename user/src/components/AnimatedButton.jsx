import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// material-ui
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

// animations
import { shimmer, pulse, bounce } from 'utils/animations';

// Styled components for different button animations
const ShimmerButton = styled(Button)(({ theme, shimmerColor = 'rgba(255, 255, 255, 0.1)' }) => ({
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '200%',
    height: '100%',
    backgroundImage: `linear-gradient(90deg,
      rgba(255,255,255,0) 0%,
      ${shimmerColor} 25%,
      ${shimmerColor} 50%,
      rgba(255,255,255,0) 100%)`,
    backgroundSize: '200% 100%',
    animation: `${shimmer} 3s infinite linear`,
    zIndex: 0
  }
}));

const PulseButton = styled(Button)(() => ({
  animation: `${pulse} 2s infinite ease-in-out`
}));

const BounceButton = styled(Button)(() => ({
  animation: `${bounce} 2s infinite ease-in-out`
}));

// ==============================|| ANIMATED BUTTON ||============================== //

const AnimatedButton = forwardRef(
  ({ children, animation = 'none', shimmerColor, ...others }, ref) => {
    // Render different button variants based on animation type
    switch (animation) {
      case 'shimmer':
        return (
          <ShimmerButton ref={ref} shimmerColor={shimmerColor} {...others}>
            {children}
          </ShimmerButton>
        );
      case 'pulse':
        return (
          <PulseButton ref={ref} {...others}>
            {children}
          </PulseButton>
        );
      case 'bounce':
        return (
          <BounceButton ref={ref} {...others}>
            {children}
          </BounceButton>
        );
      default:
        return (
          <Button ref={ref} {...others}>
            {children}
          </Button>
        );
    }
  }
);

AnimatedButton.propTypes = {
  children: PropTypes.node,
  animation: PropTypes.oneOf(['none', 'shimmer', 'pulse', 'bounce']),
  shimmerColor: PropTypes.string
};

export default AnimatedButton;
