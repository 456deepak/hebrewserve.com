import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { fadeIn, fadeInUp, pulse, bounce } from '../../utils/animations';

// Styled component with animations
const AnimatedButtonWrapper = styled(Button)(({ theme, animation, delay = 0, hoverEffect }) => {
  const animations = {
    fadeIn: fadeIn,
    fadeInUp: fadeInUp,
    pulse: pulse,
    bounce: bounce
  };

  const baseStyles = {
    opacity: 0,
    animation: `${animations[animation] || fadeIn} 0.6s ${delay}s forwards ease-out`,
    position: 'relative',
    overflow: 'hidden'
  };

  const hoverEffects = {
    glow: {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'transparent',
        borderRadius: 'inherit',
        transition: 'box-shadow 0.3s ease',
        zIndex: -1
      },
      '&:hover::before': {
        boxShadow: `0 0 15px ${theme.palette.primary.main}, 0 0 30px ${theme.palette.primary.main}30`
      }
    },
    scale: {
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'scale(1.05)'
      }
    },
    slide: {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: `linear-gradient(90deg, transparent, ${theme.palette.common.white}30, transparent)`,
        transition: 'left 0.5s ease',
        zIndex: 0
      },
      '&:hover::before': {
        left: '100%'
      }
    }
  };

  return {
    ...baseStyles,
    ...(hoverEffect && hoverEffects[hoverEffect] ? hoverEffects[hoverEffect] : {})
  };
});

const AnimatedButton = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  hoverEffect = null,
  variant = 'contained',
  color = 'primary',
  sx = {},
  ...props
}) => {
  return (
    <AnimatedButtonWrapper
      animation={animation}
      delay={delay}
      hoverEffect={hoverEffect}
      variant={variant}
      color={color}
      sx={sx}
      {...props}
    >
      {children}
    </AnimatedButtonWrapper>
  );
};

export default AnimatedButton;
