import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { fadeIn, fadeInUp, fadeInDown, fadeInLeft, fadeInRight } from '../../utils/animations';

// Styled component with animations
const AnimatedSectionWrapper = styled(Box)(({ theme, animation, delay = 0 }) => {
  const animations = {
    fadeIn: fadeIn,
    fadeInUp: fadeInUp,
    fadeInDown: fadeInDown,
    fadeInLeft: fadeInLeft,
    fadeInRight: fadeInRight
  };

  return {
    opacity: 0,
    animation: `${animations[animation] || fadeIn} 0.8s ${delay}s forwards ease-out`,
    position: 'relative'
  };
});

// Optional background effects
const BackgroundEffect = styled(Box)(({ theme, effect, color = 'primary' }) => {
  const baseStyles = {
    position: 'absolute',
    zIndex: 0
  };

  const effectStyles = {
    gradient: {
      ...baseStyles,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
      opacity: 0.8
    },
    dots: {
      ...baseStyles,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
      backgroundSize: '20px 20px'
    },
    glow: {
      ...baseStyles,
      top: '-50%',
      left: '-20%',
      width: '140%',
      height: '200%',
      background: `radial-gradient(circle, ${theme.palette[color].main}20 0%, transparent 70%)`,
      transform: 'rotate(-10deg)',
      opacity: 0.5
    }
  };

  return effectStyles[effect] || {};
});

const AnimatedSection = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  background = null,
  backgroundEffect = null,
  backgroundEffectColor = 'primary',
  sx = {},
  ...props
}) => {
  return (
    <AnimatedSectionWrapper
      animation={animation}
      delay={delay}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        ...sx
      }}
      {...props}
    >
      {backgroundEffect && (
        <BackgroundEffect 
          effect={backgroundEffect} 
          color={backgroundEffectColor} 
        />
      )}
      {background && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1,
            zIndex: 0
          }}
        />
      )}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {children}
      </Box>
    </AnimatedSectionWrapper>
  );
};

export default AnimatedSection;
