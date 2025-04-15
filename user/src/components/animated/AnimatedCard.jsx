import React from 'react';
import { Card, CardContent, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { fadeInUp, scaleIn } from '../../utils/animations';

// Styled components with animations
const AnimatedCardWrapper = styled(Card)(({ theme, animation, delay = 0 }) => {
  const animations = {
    fadeInUp: fadeInUp,
    scaleIn: scaleIn
  };

  return {
    opacity: 0,
    animation: `${animations[animation] || fadeInUp} 0.6s ${delay}s forwards ease-out`,
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: theme.shadows[8]
    },
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden'
  };
});

// Optional animated gradient overlay
const GradientOverlay = styled(Box)(({ theme, color = 'primary' }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: '4px',
  background: `linear-gradient(90deg, ${theme.palette[color].main} 0%, ${theme.palette[color].light} 50%, ${theme.palette[color].main} 100%)`,
  backgroundSize: '200% 100%',
  animation: `shimmer 2s infinite linear`,
  '@keyframes shimmer': {
    '0%': {
      backgroundPosition: '200% 0'
    },
    '100%': {
      backgroundPosition: '-200% 0'
    }
  }
}));

const AnimatedCard = ({
  children,
  animation = 'fadeInUp',
  delay = 0,
  gradient = false,
  gradientColor = 'primary',
  elevation = 2,
  sx = {},
  ...props
}) => {
  return (
    <AnimatedCardWrapper
      animation={animation}
      delay={delay}
      elevation={elevation}
      sx={sx}
      {...props}
    >
      {gradient && <GradientOverlay color={gradientColor} />}
      <CardContent sx={{ flexGrow: 1, zIndex: 1 }}>
        {children}
      </CardContent>
    </AnimatedCardWrapper>
  );
};

export default AnimatedCard;
