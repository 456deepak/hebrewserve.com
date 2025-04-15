// import React, { useState, useEffect } from 'react';
// import { useTheme } from '@mui/material/styles';
// import Chip from '@mui/material/Chip';
// import Grid from '@mui/material/Grid';
// import Button from '@mui/material/Button';
// import Modal from '@mui/material/Modal';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';
// import Swal from 'sweetalert2';
// import axios from 'utils/axios';
// import { useAccount } from 'wagmi';
// import Loader from 'components/Loader';
// import MainCard from 'components/MainCard';

// const modalStyle = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   bgcolor: 'background.paper',
//   boxShadow: 24,
//   p: 4,
//   borderRadius: 2,
// };

// export default function Pricing() {
//   const theme = useTheme();
//   const { isConnected, address } = useAccount();
//   const [plans, setPlans] = useState([]);

//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [state, setState] = useState(false);

//   useEffect(() => {
//     const fetchPlans = async () => {
//       try {
//         const res = await axios.get('/get-all-investment-plans');
//         if (res.data?.status && Array.isArray(res.data.result)) {
//           setPlans(res.data.result);
//         } else {
//           setPlans([]); // Ensure it's always an array
//         }
//       } catch (error) {
//         console.error('Error fetching plans:', error);
//         setPlans([]); // Prevent non-array values
//       }
//     };
//     fetchPlans();
//   }, []);



//   const handlePlanClick = async (id) => {
//     const res = await axios.get(`/get-investment/${id}`);
//     if (res.data?.status) {
//       setSelectedPlan(res.data.result);
//       setModalOpen(true);
//     }
//   };

//   const investInPlan = async (planId, amount) => {
//     Swal.fire({
//       title: 'Are you sure?',
//       text: `Do you want to invest $${amount}?`,
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, invest',
//       cancelButtonText: 'Cancel',
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         if (!isConnected) {
//           Swal.fire({
//             title: 'Error!',
//             text: 'Please connect your wallet first.',
//             icon: 'error',
//             confirmButtonColor: '#d33',
//           });
//           return;
//         }

//         try {
//           setState(true);
//           const res = await axios.post('/add-investment', {
//             investment_plan_id: planId,
//             amount,
//           });

//           if (res.data.status) {
//             Swal.fire({
//               title: 'Success!',
//               text: 'Your investment was successful.',
//               icon: 'success',
//               confirmButtonColor: '#3085d6',
//             });
//           } else {
//             throw new Error('Investment failed');
//           }
//         } catch (error) {
//           console.error('Investment Error:', error);
//           Swal.fire({
//             title: 'Error!',
//             text: error.message,
//             icon: 'error',
//             confirmButtonColor: '#d33',
//           });
//         } finally {
//           setState(false);
//         }
//       }
//     });
//   };

//   return (
//     <>
//       {state ? (
//         <Loader />
//       ) : (
//         <Grid container spacing={3}>
//           {plans.map((plan) => (
//             <Grid item xs={12} sm={6} md={4} key={plan.id}>
//               <MainCard>
//                 <Box sx={plan.status ? { padding: 3, borderRadius: 1, bgcolor: theme.palette.primary.lighter } : { padding: 3 }}>
//                   <Grid container spacing={3}>
//                     {plan.status && (
//                       <Grid item xs={12} sx={{ textAlign: 'center' }}>
//                         <Chip label="Active" color="success" />
//                       </Grid>
//                     )}
//                     <Grid item xs={12}>
//                       <Typography variant="h5" textAlign="center">
//                         {plan.title}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={12} textAlign="center">
//                       <Typography variant="h4">
//                         {process.env.VITE_APP_CURRENCY_TYPE}
//                         {plan.amount_from === plan.amount_to
//                           ? plan.amount_from
//                           : `${plan.amount_from}-${plan.amount_to}`}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={12}>
//                       <Button
//                         fullWidth
//                         variant="outlined"
//                         color="secondary"
//                         onClick={() => handlePlanClick(plan.id)}
//                       >
//                         View Details & Invest
//                       </Button>
//                     </Grid>
//                   </Grid>
//                 </Box>
//               </MainCard>
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       {/* Investment Plan Modal */}
//       <Modal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         aria-labelledby="investment-modal-title"
//         aria-describedby="investment-modal-description"
//       >
//         <Box sx={modalStyle}>
//           {selectedPlan && (
//             <>
//               <Typography variant="h5" id="investment-modal-title">
//                 {selectedPlan.title}
//               </Typography>
//               <Typography variant="body1" id="investment-modal-description">
//                 <strong>Amount Range: </strong>
//                 {process.env.VITE_APP_CURRENCY_TYPE}
//                 {selectedPlan.amount_from === selectedPlan.amount_to
//                   ? selectedPlan.amount_from
//                   : `${selectedPlan.amount_from}-${selectedPlan.amount_to}`}
//                 <br />
//                 <strong>ROI Percentage: </strong>
//                 {selectedPlan.percentage}%
//                 <br />
//                 <strong>Duration: </strong>
//                 {selectedPlan.days} days
//                 <br />
//                 <strong>Frequency: </strong>
//                 Every {selectedPlan.frequency_in_days} days
//                 <br />
//                 <strong>Type: </strong>
//                 {selectedPlan.type === 1
//                   ? 'Type 1 Plan'
//                   : selectedPlan.type === 2
//                     ? 'Type 2 Plan'
//                     : 'Type 3 Plan'}
//                 <br />
//                 <strong>Status: </strong>
//                 {selectedPlan.status ? 'Active' : 'Inactive'}
//                 <br />
//                 <strong>Created At: </strong>
//                 {new Date(selectedPlan.created_at).toLocaleString()}
//               </Typography>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 fullWidth
//                 onClick={() => investInPlan(selectedPlan.id, selectedPlan.amount_from)}
//                 sx={{ mt: 2 }}
//               >
//                 Confirm Investment
//               </Button>
//             </>
//           )}
//         </Box>
//       </Modal>
//     </>
//   );
// }




import React, { useState, useEffect } from 'react';
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

// Use environment variables for contract ABI and address
const contractABI = JSON.parse(process.env.REACT_APP_CONTRACT_ABI);
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const packages = [
  { id: 1, title: 'Package 1', price: '1000', description: 'Basic Package' },
  { id: 2, title: 'Package 2', price: '2000', description: 'Standard Package' },
  { id: 3, title: 'Package 3', price: '5000', description: 'Premium Package' },
  { id: 4, title: 'Package 4', price: '10000', description: 'Special Package' },
];

export default function Investments() {
  const theme = useTheme();
  const { isConnected, address } = useAccount();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [state, setState] = useState(false);

  const handlePackageClick = (pkg) => {
    setSelectedPackage(pkg);
    setModalOpen(true);
  };

  const buyPackage = async (packageId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to purchase ${selectedPackage.title}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, buy',
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

          const tx = await contract.buy_Ico(packageId);
          await tx.wait();
          const res = await axios.post('/add-investment', {
            investment_plan_id: packageId.toString(),
            amount: packages.find(pkg => pkg.id === packageId).price
          });
          Swal.fire({
            title: 'Success!',
            text: 'Your purchase was successful.',
            icon: 'success',
            confirmButtonColor: '#3085d6',
          });
        } catch (error) {
          console.error('Purchase Error:', error);
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
        {packages.map((pkg) => (
          <Grid item xs={12} sm={6} md={4} key={pkg.id}>
            <MainCard>
              <Box sx={{ padding: 3, borderRadius: 1, bgcolor: theme.palette.primary.lighter }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h5" textAlign="center">
                      {pkg.title}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} textAlign="center">
                    <Typography variant="h4">
                      {process.env.VITE_APP_CURRENCY_TYPE}{pkg.price}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="secondary"
                      onClick={() => handlePackageClick(pkg)}
                    >
                      View Details & Buy
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </MainCard>
          </Grid>
        ))}
      </Grid>


      {/* Package Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="package-modal-title"
        aria-describedby="package-modal-description"
      >
        <Box sx={modalStyle}>
          {selectedPackage && (
            <>
              <Typography variant="h5" id="package-modal-title">
                {selectedPackage.title}
              </Typography>
              <Typography variant="body1" id="package-modal-description">
                <strong>Description: </strong>{selectedPackage.description}<br />
                <strong>Price: </strong>{process.env.VITE_APP_CURRENCY_TYPE}{selectedPackage.price}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => buyPackage(selectedPackage.id)}
                sx={{ mt: 2 }}
              >
                Confirm Purchase
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}