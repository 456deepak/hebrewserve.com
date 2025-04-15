import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';

// Animation variants
const pageVariants = {
  initial: {
    opacity: 0
  },
  in: {
    opacity: 1
  },
  out: {
    opacity: 0
  }
};

const fadeUpVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -20
  }
};

const fadeDownVariants = {
  initial: {
    opacity: 0,
    y: -20
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: 20
  }
};

const fadeLeftVariants = {
  initial: {
    opacity: 0,
    x: -20
  },
  in: {
    opacity: 1,
    x: 0
  },
  out: {
    opacity: 0,
    x: 20
  }
};

const fadeRightVariants = {
  initial: {
    opacity: 0,
    x: 20
  },
  in: {
    opacity: 1,
    x: 0
  },
  out: {
    opacity: 0,
    x: -20
  }
};

const scaleVariants = {
  initial: {
    opacity: 0,
    scale: 0.9
  },
  in: {
    opacity: 1,
    scale: 1
  },
  out: {
    opacity: 0,
    scale: 1.1
  }
};

const slideUpVariants = {
  initial: {
    opacity: 0,
    y: '100%'
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: '-100%'
  }
};

// Transition presets
const transitions = {
  default: {
    duration: 0.3,
    ease: 'easeInOut'
  },
  smooth: {
    duration: 0.5,
    ease: [0.43, 0.13, 0.23, 0.96]
  },
  bounce: {
    type: 'spring',
    stiffness: 300,
    damping: 30
  },
  slow: {
    duration: 0.8,
    ease: 'easeInOut'
  }
};

const PageTransition = ({
  children,
  variant = 'fade',
  transition = 'default',
  duration,
  delay = 0,
  ...props
}) => {
  // Select animation variant
  let selectedVariant;
  switch (variant) {
    case 'fadeUp':
      selectedVariant = fadeUpVariants;
      break;
    case 'fadeDown':
      selectedVariant = fadeDownVariants;
      break;
    case 'fadeLeft':
      selectedVariant = fadeLeftVariants;
      break;
    case 'fadeRight':
      selectedVariant = fadeRightVariants;
      break;
    case 'scale':
      selectedVariant = scaleVariants;
      break;
    case 'slideUp':
      selectedVariant = slideUpVariants;
      break;
    case 'fade':
    default:
      selectedVariant = pageVariants;
      break;
  }

  // Select transition preset
  let selectedTransition = transitions[transition] || transitions.default;
  
  // Override duration if provided
  if (duration) {
    selectedTransition = {
      ...selectedTransition,
      duration
    };
  }

  return (
    <Box
      component={motion.div}
      initial="initial"
      animate="in"
      exit="out"
      variants={selectedVariant}
      transition={{
        ...selectedTransition,
        delay
      }}
      style={{ width: '100%', height: '100%' }}
      {...props}
    >
      {children}
    </Box>
  );
};

PageTransition.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['fade', 'fadeUp', 'fadeDown', 'fadeLeft', 'fadeRight', 'scale', 'slideUp']),
  transition: PropTypes.oneOf(['default', 'smooth', 'bounce', 'slow']),
  duration: PropTypes.number,
  delay: PropTypes.number
};

export default PageTransition;
