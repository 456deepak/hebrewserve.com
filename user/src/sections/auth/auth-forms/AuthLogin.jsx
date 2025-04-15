import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import { openSnackbar } from 'api/snackbar';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import axios from 'utils/axios';

const contractABI = process.env.REACT_APP_CONTRACT_ABI;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

export default function AuthLogin() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [referralId, setReferralId] = useState('');
  const { address: userAddress, isConnected } = useAccount();
  const { login, register } = useAuth();

  const scriptedRef = useScriptRef();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferralId(ref);
    }
  }, []);
  useEffect(() => {
    const checkRegistration = async () => {
      // console.log("isConnected", isConnected)
      // console.log("userAddress", userAddress)
      if (isConnected && userAddress) {
        try {
          const res = await axios.post('/check-address', { userAddress });
          console.log('Response:', res.data);

          setIsRegistered(res.data.result.isRegistered);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    checkRegistration();
  }, [isConnected, userAddress]);

  const handleRegistrationOrLogin = async () => {
    if (isConnected) {
      try {

        if (!isRegistered) {
          
       
          await register(userAddress, referralId);
          openSnackbar({
            open: true,
            message: 'Registration successful!',
            variant: 'alert',
            alert: { color: 'success' }
          });
          setIsRegistered(true);
        } else {
          await login(userAddress);
          if (scriptedRef.current) {
            openSnackbar({
              open: true,
              message: 'Login successful!',
              variant: 'alert',
              alert: { color: 'success' }
            });
          }
        }
      } catch (error) {
        openSnackbar({
          open: true,
          message: `Operation failed: ${error.message}`,
          variant: 'alert',
          alert: { color: 'error' }
        });
        console.error('Operation failed:', error);
      }
    } else {
      alert('Please connect your wallet!');
    }
  };

  return (
    <MainCard title="Register or Login">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ConnectButton />
        </Grid>
        {!isRegistered && isConnected && (
          <Grid item xs={12}>
            <TextField
              label="Referral ID"
              variant="outlined"
              fullWidth
              value={referralId}
              onChange={(e) => setReferralId(e.target.value)}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <AnimateButton>
            <Button variant="contained" onClick={handleRegistrationOrLogin} disabled={!isConnected}>
              {isRegistered ? 'Login' : 'Register & Login'}
            </Button>
          </AnimateButton>
        </Grid>
      </Grid>
    </MainCard>
  );
}
