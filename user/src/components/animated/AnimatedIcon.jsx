import React from 'react';
import { Box, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { fadeIn, pulse, rotate, bounce } from '../../utils/animations';

// Styled component with animations
const AnimatedIconWrapper = styled(Box)(({ theme, animation, delay = 0, continuous }) => {
  const animations = {
    fadeIn: fadeIn,
    pulse: pulse,
    rotate: rotate,
    bounce: bounce
  };

  return {
    opacity: animation === 'fadeIn' ? 0 : 1,
    animation: continuous
      ? `${animations[animation] || pulse} ${animation === 'rotate' ? '2s' : '3s'} ${delay}s infinite ease-in-out`
      : `${animations[animation] || fadeIn} 0.6s ${delay}s forwards ease-out`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
});

// Styled avatar for icon background
const IconBackground = styled(Avatar)(({ theme, color = 'primary', variant = 'filled', size = 40 }) => {
  const variants = {
    filled: {
      backgroundColor: theme.palette[color].main,
      color: theme.palette[color].contrastText
    },
    light: {
      backgroundColor: theme.palette[color].light + '40',
      color: theme.palette[color].main
    },
    outlined: {
      backgroundColor: 'transparent',
      color: theme.palette[color].main,
      border: `2px solid ${theme.palette[color].main}`
    },
    gradient: {
      background: `linear-gradient(135deg, ${theme.palette[color].main}, ${theme.palette[color].light})`,
      color: theme.palette[color].contrastText
    }
  };

  return {
    width: size,
    height: size,
    ...variants[variant]
  };
});

const AnimatedIcon = ({
  icon,
  animation = 'fadeIn',
  delay = 0,
  continuous = false,
  color = 'primary',
  variant = 'filled',
  size = 40,
  sx = {},
  ...props
}) => {
  return (
    <AnimatedIconWrapper
      animation={animation}
      delay={delay}
      continuous={continuous}
      sx={sx}
      {...props}
    >
      <IconBackground
        color={color}
        variant={variant}
        size={size}
      >
        {icon}
      </IconBackground>
    </AnimatedIconWrapper>
  );
};

export default AnimatedIcon;
