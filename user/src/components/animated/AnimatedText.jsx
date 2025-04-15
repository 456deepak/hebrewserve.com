import React from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { fadeIn, fadeInUp, fadeInDown, fadeInLeft, fadeInRight } from '../../utils/animations';

// Styled component with animations
const AnimatedTypography = styled(Typography)(({ theme, animation, delay = 0 }) => {
  const animations = {
    fadeIn: fadeIn,
    fadeInUp: fadeInUp,
    fadeInDown: fadeInDown,
    fadeInLeft: fadeInLeft,
    fadeInRight: fadeInRight
  };

  return {
    opacity: 0,
    animation: `${animations[animation] || fadeIn} 0.8s ${delay}s forwards ease-out`
  };
});

// Optional gradient text effect
const GradientText = styled(Typography)(({ theme, gradient }) => {
  if (!gradient) return {};

  const gradients = {
    primary: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    secondary: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})`,
    success: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
    info: `linear-gradient(90deg, ${theme.palette.info.main}, ${theme.palette.info.light})`,
    warning: `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`,
    error: `linear-gradient(90deg, ${theme.palette.error.main}, ${theme.palette.error.light})`,
    rainbow: 'linear-gradient(90deg, #ff0000, #ffa500, #ffff00, #008000, #0000ff, #4b0082, #ee82ee)'
  };

  return {
    background: gradients[gradient] || gradients.primary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    display: 'inline-block'
  };
});

const AnimatedText = ({
  children,
  variant = 'body1',
  animation = 'fadeIn',
  delay = 0,
  gradient = null,
  sx = {},
  ...props
}) => {
  if (gradient) {
    return (
      <AnimatedTypography
        component={GradientText}
        variant={variant}
        animation={animation}
        delay={delay}
        gradient={gradient}
        sx={sx}
        {...props}
      >
        {children}
      </AnimatedTypography>
    );
  }

  return (
    <AnimatedTypography
      variant={variant}
      animation={animation}
      delay={delay}
      sx={sx}
      {...props}
    >
      {children}
    </AnimatedTypography>
  );
};

export default AnimatedText;
