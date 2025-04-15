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
import { Card, CardContent, Input, InputAdornment, TextField } from '@mui/material';

// Use environment variables for contract ABI and address
const contractABI = JSON.parse(process.env.REACT_APP_CONTRACT_ABI);
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

export default function AddFunds() {
    const theme = useTheme();
    const [user, setUser] = useState()
    const { isConnected, address } = useAccount();
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [state, setState] = useState(false);
    const [amount, setAmount] = useState('');

    const handlePackageClick = (pkg) => {
        setSelectedPackage(pkg);
        setModalOpen(true);
    };
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        setUser(user)
    }, [])

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const buyPackage = async () => {
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

                    const tx = await contract.stakeICO();
                    await tx.wait();
                    await axios.post('/addstake', {
                        amount: amount,
                        userAddress: address
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
                            Stake ICO
                        </Typography>
                        <Card variant="outlined" sx={{ margin: 2 }}>
                            <CardContent>
                                <Typography variant="h5" component="div" gutterBottom>
                                    Wallet Balance
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body1" color="textSecondary">
                                            Total Bought ICO
                                        </Typography>
                                        <Typography variant="h6">
                                            {user?.wallet_topup || 0} RBM
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body1" color="textSecondary">
                                            Total Stacked ICO
                                        </Typography>
                                        <Typography variant="h6">
                                            {user?.wallet || 0} RBM
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
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
                                onClick={buyPackage}
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
                    <Button onClick={buyPackage}>Confirm</Button>
                </Box>
            </Modal>
        </>
    );
}