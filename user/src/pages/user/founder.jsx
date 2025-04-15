import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, useTheme, useMediaQuery } from '@mui/material';
import MainCard from 'components/MainCard';
import { Button } from '@mui/material';
import { Copy, ArrowRight } from 'iconsax-react';
import axios from 'utils/axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuth from 'hooks/useAuth';
import { ethers } from 'ethers';

const FounderPackage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user: userData } = useAuth();

  const [isFounderMember, setIsFounderMember] = useState(userData?.isFounderMember);
  
  // Breakpoint hooks for responsive design
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  
  // await provider.send('eth_requestAccounts', []); // Ensure wallet connection
  // const signer = provider.getSigner();
  // const contract = new ethers.Contract(contractAddress, contractABI, signer);
  const handleFounderMembership = async () => {
    try {
      if(true){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, process.env.REACT_APP_CONTRACT_ABI, signer);
        // const price = await contract.packagePrice(14)
        const tx = await contract.buy_Founder_Package()
        await tx.wait()
      }
      const response = await axios.post('/add-membership', {
        membershipType: 'founder'
      });

      if (response.data.status) {
        setIsFounderMember(true);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.data.msg,
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message || 'Something went wrong!'
      });
    }
  };

  return (
    <MainCard title="Founder Membership">
      <Box sx={{ width: '110%', p: { xs: 1, sm: 2, md: 3} }}>
        <Grid container justifyContent="start">
          <Grid item xs={12} sm={10} md={8} lg={6}>
            <Card
              sx={{
                bgcolor: 'grey.900',
                background: 'linear-gradient(135deg, rgb(190, 99, 99) 0%, rgb(203, 206, 190) 100%)',
                borderRadius: { xs: 2, sm: 3 },
                position: 'relative',
                overflow: 'hidden',
                height: 'auto',
                minHeight: { xs: '200px', sm: '220px' },
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                '&:hover': {
                  boxShadow: '0 4px 25px rgba(0,0,0,0.6)',
                  transform: 'translateY(-5px)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
                {/* Header Section */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'center', sm: 'flex-start' },
                    gap: { xs: 2, sm: 0 }
                  }}
                >
                  <Typography 
                    variant={isXs ? "h4" : "h3"} 
                    color="common.white" 
                    sx={{ 
                      fontWeight: 700,
                      textAlign: { xs: 'center', sm: 'left' }
                    }}
                  >
                    Founder Membership
                  </Typography>
                  <Typography 
                    variant={isXs ? "h4" : "h3"} 
                    color="common.white" 
                    sx={{ 
                      fontWeight: 700,
                      textAlign: { xs: 'center', sm: 'right' }
                    }}
                  >
                    $ 5000
                  </Typography>
                </Box>

                {/* Benefits Section */}
                <Box 
                  sx={{ 
                    mt: { xs: 2, sm: 3 },
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'center', sm: 'flex-end' },
                    gap: { xs: 3, sm: 0 }
                  }}
                >
                  <ul
                    style={{
                      listStyleType: 'disc',
                      padding: 0,
                      margin: 0,
                      color: 'white',
                      fontSize: isXs ? '1rem' : '1.25rem',
                      lineHeight: '1.6',
                      textAlign: isXs ? 'center' : 'left'
                    }}
                  >
                    <li>Founder members earn 5% of CTO</li>
                    <li> Non-working members earn max X2</li>
                    <li>Working members earn max x3 and many more.....</li>
                  </ul>

                  <Button
                    variant="contained"
                    onClick={handleFounderMembership}
                    disabled={isFounderMember}
                    sx={{
                      bgcolor: 'rgb(226, 71, 71)',
                      color: 'common.white',
                      borderRadius: '20px',
                      px: { xs: 2, sm: 3 },
                      py: { xs: 0.75, sm: 1 },
                      '&:hover': {
                        bgcolor: '#C026D3',
                        transform: 'scale(1.05)',
                        transition: 'all 0.3s ease'
                      },
                      textTransform: 'none',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      width: { xs: '100%', sm: 'auto' },
                      marginTop: { xs: 2, sm: 0 }
                    }}
                    endIcon={<ArrowRight size={16} />}
                  >
                    {isFounderMember ? 'Already a Founder Member' : 'Buy Now'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </MainCard>
  );
};

export default FounderPackage;