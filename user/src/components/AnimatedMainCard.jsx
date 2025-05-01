import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

// project-imports
import Highlighter from 'components/third-party/Highlighter';
import useConfig from 'hooks/useConfig';

// animations
import { 
  fadeIn, 
  fadeInUp, 
  hoverElevate, 
  hoverScale, 
  hoverGlow,
  pulse
} from 'utils/animations';

// header style
const headerSX = { p: 2.5, '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' } };

// ==============================|| ANIMATED - MAIN CARD ||============================== //

function AnimatedMainCard(
  {
    border = true,
    boxShadow = true,
    children,
    subheader,
    content = true,
    contentSX = {},
    darkTitle,
    divider = true,
    elevation,
    secondary,
    shadow,
    sx = {},
    title,
    codeHighlight = false,
    codeString,
    modal = false,
    animation = 'fadeIn', // new prop for animation type
    delay = 0, // delay for animation
    hover = 'elevate', // hover animation type: 'none', 'scale', 'elevate', 'glow'
    glowColor = 'rgba(240, 185, 11, 0.5)', // color for glow effect
    ...others
  },
  ref
) {
  const theme = useTheme();
  const { themeContrast } = useConfig();

  // Animation styles based on the animation prop
  const getAnimationStyle = () => {
    switch (animation) {
      case 'fadeIn':
        return {
          opacity: 0,
          animation: `${fadeIn} 0.6s ${delay}s forwards ease-out`
        };
      case 'fadeInUp':
        return {
          opacity: 0,
          transform: 'translateY(20px)',
          animation: `${fadeInUp} 0.8s ${delay}s forwards ease-out`
        };
      case 'pulse':
        return {
          animation: `${pulse} 2s infinite ease-in-out`
        };
      default:
        return {};
    }
  };

  // Hover styles based on the hover prop
  const getHoverStyle = () => {
    switch (hover) {
      case 'scale':
        return hoverScale;
      case 'elevate':
        return hoverElevate;
      case 'glow':
        return hoverGlow(glowColor);
      default:
        return {};
    }
  };

  return (
    <Card
      elevation={elevation || 0}
      ref={ref}
      {...others}
      sx={{
        position: 'relative',
        border: border ? '1px solid' : 'none',
        borderRadius: 1.5,
        borderColor: theme.palette.divider,
        ...(((themeContrast && boxShadow) || shadow) && {
          boxShadow: shadow ? shadow : theme.customShadows.z1
        }),
        ...(codeHighlight && {
          '& pre': {
            m: 0,
            p: '12px !important',
            fontFamily: theme.typography.fontFamily,
            fontSize: '0.75rem'
          }
        }),
        ...(modal && {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: `calc( 100% - 50px)`, sm: 'auto' },
          '& .MuiCardContent-root': {
            overflowY: 'auto',
            minHeight: 'auto',
            maxHeight: `calc(100vh - 200px)`
          }
        }),
        ...getAnimationStyle(),
        ...getHoverStyle(),
        ...sx
      }}
    >
      {/* card header and action */}
      {!darkTitle && title && (
        <CardHeader sx={headerSX} titleTypographyProps={{ variant: 'subtitle1' }} title={title} action={secondary} subheader={subheader} />
      )}
      {darkTitle && title && <CardHeader sx={headerSX} title={<Typography variant="h4">{title}</Typography>} action={secondary} />}

      {/* content & header divider */}
      {title && divider && <Divider />}

      {/* card content */}
      {content && <CardContent sx={contentSX}>{children}</CardContent>}
      {!content && children}

      {/* card footer - clipboard & highlighter  */}
      {codeString && (
        <>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Highlighter codeString={codeString} codeHighlight={codeHighlight} />
        </>
      )}
    </Card>
  );
}

export default forwardRef(AnimatedMainCard);

AnimatedMainCard.propTypes = {
  border: PropTypes.bool,
  boxShadow: PropTypes.bool,
  children: PropTypes.node,
  subheader: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  content: PropTypes.bool,
  contentSX: PropTypes.object,
  darkTitle: PropTypes.bool,
  divider: PropTypes.bool,
  elevation: PropTypes.number,
  secondary: PropTypes.any,
  shadow: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  codeHighlight: PropTypes.bool,
  codeString: PropTypes.string,
  modal: PropTypes.bool,
  animation: PropTypes.oneOf(['fadeIn', 'fadeInUp', 'pulse', 'none']),
  delay: PropTypes.number,
  hover: PropTypes.oneOf(['none', 'scale', 'elevate', 'glow']),
  glowColor: PropTypes.string,
  others: PropTypes.any
};
