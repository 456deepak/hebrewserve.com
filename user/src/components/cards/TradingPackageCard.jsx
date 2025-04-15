import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowRight, Chart } from 'iconsax-react';
import { fadeInUp, pulse } from '../../utils/animations';

// Styled components
const CardWrapper = styled(Paper)(({ theme, delay = 0, hoverEffect = true }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  height: '100%',
  position: 'relative',
  opacity: 0,
  animation: `${fadeInUp} 0.6s ${delay}s forwards ease-out`,
  transition: 'transform 0.3s, box-shadow 0.3s',
  ...(hoverEffect && {
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.2)'
    }
  })
}));

const CardHeader = styled(Box)(({ theme, bgColor }) => ({
  height: 160,
  background: bgColor || `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden'
}));

const CardContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper
}));

const FeatureItem = styled(Typography)(({ theme, color = 'primary' }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1.5),
  '&:last-child': {
    marginBottom: 0
  }
}));

const FeatureDot = styled(Box)(({ theme, color = 'primary' }) => ({
  width: 6,
  height: 6,
  borderRadius: '50%',
  backgroundColor: theme.palette[color].main,
  marginRight: theme.spacing(1.5)
}));

const ShineEffect = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '-50%',
  left: '-50%',
  width: '200%',
  height: '200%',
  background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
  transform: 'rotate(30deg)',
  animation: `${pulse} 8s infinite linear`
}));

const PriceTag = styled(Box)(({ theme, color = 'primary' }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  padding: '4px 12px',
  borderRadius: 20,
  backgroundColor: alpha(theme.palette[color].main, 0.2),
  color: theme.palette[color].main,
  fontWeight: 'bold',
  fontSize: '0.875rem',
  backdropFilter: 'blur(4px)'
}));

const TradingPackageCard = ({
  title,
  minInvestment,
  maxInvestment,
  dailyProfit,
  features = [],
  bgColor,
  buttonText = 'Invest Now',
  buttonLink = '/user/trading-package',
  color = 'primary',
  delay = 0,
  hoverEffect = true
}) => {
  const theme = useTheme();

  return (
    <CardWrapper elevation={0} delay={delay} hoverEffect={hoverEffect}>
      <CardHeader bgColor={bgColor}>
        <ShineEffect />
        <Typography variant="h3" color="common.white" sx={{ fontWeight: 700, position: 'relative', zIndex: 1 }}>
          {title}
        </Typography>
        {minInvestment && (
          <PriceTag color={color}>
            ${minInvestment}+
          </PriceTag>
        )}
      </CardHeader>
      
      <CardContent>
        <Box sx={{ mb: 3 }}>
          {minInvestment && (
            <FeatureItem variant="body1" color="common.white">
              <FeatureDot color={color} />
              Min Investment: ${minInvestment}
            </FeatureItem>
          )}
          
          {maxInvestment && (
            <FeatureItem variant="body1" color="common.white">
              <FeatureDot color={color} />
              Max Investment: ${maxInvestment}
            </FeatureItem>
          )}
          
          {dailyProfit && (
            <FeatureItem variant="body1" color="common.white">
              <FeatureDot color={color} />
              Daily Profit: {dailyProfit}%
            </FeatureItem>
          )}
          
          {features.map((feature, index) => (
            <FeatureItem key={index} variant="body1" color="common.white">
              <FeatureDot color={color} />
              {feature}
            </FeatureItem>
          ))}
        </Box>
        
        <Button
          component={Link}
          to={buttonLink}
          variant="contained"
          color={color}
          fullWidth
          sx={{
            borderRadius: 2,
            py: 1.2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600
          }}
          endIcon={<ArrowRight size={18} />}
        >
          {buttonText}
        </Button>
      </CardContent>
    </CardWrapper>
  );
};

TradingPackageCard.propTypes = {
  title: PropTypes.string.isRequired,
  minInvestment: PropTypes.number,
  maxInvestment: PropTypes.number,
  dailyProfit: PropTypes.number,
  features: PropTypes.array,
  bgColor: PropTypes.string,
  buttonText: PropTypes.string,
  buttonLink: PropTypes.string,
  color: PropTypes.string,
  delay: PropTypes.number,
  hoverEffect: PropTypes.bool
};

export default TradingPackageCard;
