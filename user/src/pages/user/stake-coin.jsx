import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import axios from 'utils/axios';
import { TextField, InputAdornment } from '@mui/material';

// Use environment variables for contract ABI and address
const contractABI = JSON.parse(process.env.REACT_APP_CONTRACT_ABI);
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const contractABI2 = JSON.parse(process.env.REACT_APP_CONTRACT_ABI2);
const contractAddress2 = process.env.REACT_APP_CONTRACT_ADDRESS2;

export default function StakeToken() {
    const theme = useTheme();
    const [user, setUser] = useState();
    const { isConnected, address } = useAccount();
    const [modalOpen, setModalOpen] = useState(false);
    const [state, setState] = useState(false);
    const [amount, setAmount] = useState('');
    const [balance, setBalance] = useState('0');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setUser(user);
        // fetchBalance();
    }, [address]);

    const fetchBalance = async () => {
        if (isConnected) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(contractAddress, contractABI, provider);
            const userBalance = await contract.balanceOf(address);
            console.log(userBalance);
            
            setBalance(ethers.utils.formatUnits(userBalance, 18));
        }
    };

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const stakeTokens = async () => {
        // if (parseFloat(amount) > parseFloat(balance)) {
        //     Swal.fire({
        //         title: 'Error!',
        //         text: 'Insufficient balance to stake this amount.',
        //         icon: 'error',
        //         confirmButtonColor: '#d33',
        //     });
        //     return;
        // }

        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to stake ${amount} tokens?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, stake',
            cancelButtonText: 'Cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!isConnected) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Please connect your wallet first.',
                        icon: 'error',
                        confirmButtonColor: '#d33',
                    });
                    return;
                }

                try {
                    setState(true);
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    const contract = new ethers.Contract(contractAddress, contractABI, signer);
                    const contract2 = new ethers.Contract(contractAddress2, contractABI2, signer);
                    const amnt = "100000";
                  const txinit = await contract2.approve(contractAddress, ethers.utils.parseUnits(amnt, 18));
                    await txinit.wait(); 
                    const tx = await contract.stakeToken(ethers.utils.parseUnits(amount, 18));
                    await tx.wait();      
                    const res = await axios.post('/addstakecoin', {
                        userAddress: address,
                        amount: amount
                      });
                    Swal.fire({
                        title: 'Success!',
                        text: 'Your staking was successful.',
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                    });
                } catch (error) {
                    console.error('Staking Error:', error);
                    Swal.fire({
                        title: 'Error!',
                        text: error.message,
                        icon: 'error',
                        confirmButtonColor: '#d33',
                    });
                } finally {
                    setState(false);
                }
            }
        });
    };

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <MainCard>
                        <Typography variant="h4" gutterBottom>
                            Stake Tokens
                        </Typography>
                        <Box sx={{ padding: theme.spacing(2), maxWidth: 400, margin: 'auto' }}>
                            <Typography variant="h6" gutterBottom>
                                Enter Amount to Stake
                            </Typography>
                            <TextField
                                type="number"
                                value={amount}
                                onChange={handleAmountChange}
                                placeholder="Enter amount to stake"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">RBM</InputAdornment>,
                                }}
                                sx={{ marginBottom: theme.spacing(2) }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={stakeTokens}
                                fullWidth
                                sx={{ padding: theme.spacing(1.5) }}
                            >
                                Stake
                            </Button>
                        </Box>
                    </MainCard>
                </Grid>
            </Grid>
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <Box>
                    <Typography variant="h6">
                        Confirm Staking
                    </Typography>
                    <Button onClick={stakeTokens}>Confirm</Button>
                </Box>
            </Modal>
        </>
    );
}