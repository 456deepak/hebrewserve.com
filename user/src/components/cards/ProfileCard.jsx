import React from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Typography, 
  Paper,
  Avatar,
  Button,
  Chip,
  Divider,
  useTheme,
  alpha,
  IconButton,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { fadeInUp, gradientShift } from '../../utils/animations';
import { Copy } from 'iconsax-react';
import Swal from 'sweetalert2';

// Styled components
const CardWrapper = styled(Paper)(({ theme, delay = 0 }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  position: 'relative',
  opacity: 0,
  animation: `${fadeInUp} 0.6s ${delay}s forwards ease-out`
}));

const CardHeader = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(4),
  background: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
  backgroundSize: '200% 200%',
  animation: `${gradientShift} 15s ease infinite`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url(/dashboard-pattern.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.05,
    zIndex: 0
  }
}));

const CardContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper
}));

const AvatarWrapper = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  border: `3px solid ${alpha(theme.palette.common.white, 0.8)}`,
  boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.4)}`,
  marginRight: theme.spacing(3)
}));

const StatsBox = styled(Box)(({ theme, color = 'primary' }) => ({
  padding: theme.spacing(2),
  backgroundColor: alpha(theme.palette[color].main, 0.1),
  borderRadius: 8,
  textAlign: 'center'
}));

const ProfileCard = ({
  username,
  userId,
  avatar = '/default-profile.png',
  referralLink,
  stats = [],
  delay = 0
}) => {
  const theme = useTheme();

  const handleCopyUsername = () => {
    navigator.clipboard.writeText(username || '');
    Swal.fire({
      icon: 'success',
      title: 'Username Copied!',
      showConfirmButton: false,
      timer: 1500
    });
  };

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink || '');
    Swal.fire({
      icon: 'success',
      title: 'Referral Link Copied!',
      showConfirmButton: false,
      timer: 1500
    });
  };

  return (
    <CardWrapper elevation={3} delay={delay}>
      <CardHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <AvatarWrapper src={avatar} alt={username} />
          
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 0.5 }}>
              <Chip 
                label={`ID: ${userId?.substring(0, 6)}`} 
                size="small"
                sx={{ 
                  bgcolor: alpha(theme.palette.common.white, 0.2), 
                  color: theme.palette.common.white,
                  fontWeight: 'bold',
                  '& .MuiChip-label': { px: 1 }
                }} 
              />
              <Typography variant="h5" color="common.white" sx={{ fontWeight: 600 }}>
                Welcome back!
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" color="common.white" sx={{ fontWeight: 500 }}>
                {username || 'Username not available'}
              </Typography>
              <Tooltip title="Copy Username">
                <IconButton
                  size="small"
                  onClick={handleCopyUsername}
                  sx={{ 
                    color: 'common.white',
                    bgcolor: alpha('#fff', 0.1),
                    '&:hover': { bgcolor: alpha('#fff', 0.2) }
                  }}
                >
                  <Copy size={16} variant="Bold" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </CardHeader>
      
      <CardContent>
        {referralLink && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Your Referral Link
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              p: 2,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}>
              <Typography 
                variant="body2"
                color="text.primary"
                sx={{ 
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {referralLink}
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<Copy size={16} />}
                onClick={handleCopyReferralLink}
                sx={{
                  whiteSpace: 'nowrap',
                  textTransform: 'none'
                }}
              >
                Copy
              </Button>
            </Box>
          </Box>
        )}
        
        {stats.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(stats.length, 3)}, 1fr)`, gap: 2 }}>
              {stats.map((stat, index) => (
                <StatsBox key={index} color={stat.color || 'primary'}>
                  <Typography variant="h5" color={theme.palette[stat.color || 'primary'].main} sx={{ fontWeight: 600 }}>
                    {stat.prefix || ''}{stat.value}{stat.suffix || ''}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </StatsBox>
              ))}
            </Box>
          </>
        )}
      </CardContent>
    </CardWrapper>
  );
};

ProfileCard.propTypes = {
  username: PropTypes.string,
  userId: PropTypes.string,
  avatar: PropTypes.string,
  referralLink: PropTypes.string,
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      prefix: PropTypes.string,
      suffix: PropTypes.string,
      color: PropTypes.string
    })
  ),
  delay: PropTypes.number
};

export default ProfileCard;
