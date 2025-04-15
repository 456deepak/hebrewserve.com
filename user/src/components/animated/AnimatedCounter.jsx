import React, { useState, useEffect, useRef } from 'react';
import { Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { fadeIn } from '../../utils/animations';

// Styled component with animations
const AnimatedCounterWrapper = styled(Box)(({ theme, delay = 0 }) => ({
  opacity: 0,
  animation: `${fadeIn} 0.6s ${delay}s forwards ease-out`,
  display: 'inline-flex',
  alignItems: 'center'
}));

const AnimatedCounter = ({
  start = 0,
  end,
  duration = 2000,
  delay = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  separator = ',',
  variant = 'h4',
  color = 'primary',
  sx = {},
  ...props
}) => {
  const [count, setCount] = useState(start);
  const countRef = useRef(start);
  const timerRef = useRef(null);

  useEffect(() => {
    const startTime = Date.now();
    const endValue = Number(end);
    const startValue = Number(start);
    const changeInValue = endValue - startValue;
    
    const updateCounter = () => {
      const now = Date.now();
      const elapsedTime = now - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function for smoother animation
      const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
      const easedProgress = easeOutQuart(progress);
      
      const currentValue = startValue + changeInValue * easedProgress;
      countRef.current = currentValue;
      setCount(currentValue);
      
      if (progress < 1) {
        timerRef.current = requestAnimationFrame(updateCounter);
      }
    };
    
    // Delay the start of the animation
    const delayTimeout = setTimeout(() => {
      timerRef.current = requestAnimationFrame(updateCounter);
    }, delay * 1000);
    
    return () => {
      clearTimeout(delayTimeout);
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
    };
  }, [start, end, duration, delay]);
  
  // Format the number with separators and decimals
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: true
    }).format(num).replace(/,/g, separator);
  };

  return (
    <AnimatedCounterWrapper delay={delay} sx={sx} {...props}>
      <Typography 
        variant={variant} 
        color={color} 
        sx={{ fontWeight: 'bold' }}
      >
        {prefix}{formatNumber(count)}{suffix}
      </Typography>
    </AnimatedCounterWrapper>
  );
};

export default AnimatedCounter;
