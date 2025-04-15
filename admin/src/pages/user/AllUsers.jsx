import { openSnackbar } from 'api/snackbar';
import CommonDatatable from 'helpers/CommonDatatable';
import { useEffect, useMemo, useState } from 'react';
import axios from 'utils/axios';
import UpdateProfile from 'myComponents/profile';
import { Button } from '@mui/material';
import ExportCSV from 'myComponents/ExportCSV';

export default function AllUsers() {
  // State to store the user whose profile is being edited
  const [updateProfile, setUpdateProfile] = useState();

  const apiPoint = 'get-all-users';

  // Function to log in as a specific user
  const logInUser = async (user_id) => {
    if (!user_id) return;
    try {
      const res = await axios.post('/user-login-request', { user_id });
      if (res.status === 200) {
        window.open(res.data?.result.url);
      } else {
        openSnackbar({
          open: true,
          message: res.data.msg,
          variant: 'alert',
          alert: { color: 'error' },
        });
      }
    } catch (error) {
      openSnackbar({
        open: true,
        message: 'Failed to log in as user',
        variant: 'alert',
        alert: { color: 'error' },
      });
    }
  };

  // Function to reset the device ID of a specific user
  const resetDeviceId = async (user_id) => {
    if (!user_id) return;
    try {
      const res = await axios.post('/reset-device-id', { user_id });
      if (res.status === 200) {
        openSnackbar({
          open: true,
          message: 'Device ID reset successfully.',
          variant: 'alert',
          alert: { color: 'success' },
        });
      } else {
        openSnackbar({
          open: true,
          message: res.data.msg || 'Failed to reset Device ID.',
          variant: 'alert',
          alert: { color: 'error' },
        });
      }
    } catch (error) {
      openSnackbar({
        open: true,
        message: 'Error resetting Device ID.',
        variant: 'alert',
        alert: { color: 'error' },
      });
    }
  };

  const columns = useMemo(
    () => [
      {
        header: 'User ID',
        accessorKey: '_id',
        cell: (props) => (
          <b
            style={{ cursor: 'pointer' }}
            onClick={() => logInUser(props.getValue())}
          >
            {props.getValue()}
          </b>
        ),
      },
      {
        header: 'Refer ID',
        accessorKey: 'trace_id',
      },
      {
        header: 'Sponsor ID',
        accessorKey: 'refer_id',
      },
      {
        header: 'Name',
        accessorKey: 'name',
      },
      {
        header: 'Identifier',
        accessorKey: 'username',
      },
      {
        header: 'Phone Number',
        accessorKey: 'phone_number',
      },
      {
        header: 'Wallet',
        accessorKey: 'wallet',
      },
      {
        header: 'Total Investments',
        accessorKey: 'topup',
      },
      {
        header: 'Date',
        accessorKey: 'created_at',
        cell: (props) => new Date(props.getValue()).toLocaleString(),
        enableColumnFilter: false,
        enableGrouping: false,
      },
      {
        header: 'Edit Profile',
        accessorKey: '',
        cell: (props) => (
          <Button
            onClick={() => setUpdateProfile(props.cell.row.original)}
            variant="shadow"
            type="submit"
            color="primary"
          >
            Edit
          </Button>
        ),
      },
      // {
      //   header: 'Reset Device ID',
      //   accessorKey: '',
      //   cell: (props) => (
      //     <Button
      //       onClick={() => resetDeviceId(props.cell.row.original._id)}
      //       variant="shadow"
      //       type="submit"
      //       color="primary"
      //     >
      //       Reset_Device_ID
      //     </Button>
      //   ),
      // },
    ],
    []
  );

  return (
    <>
      <ExportCSV type="allUsers" />
      {updateProfile ? (
        <UpdateProfile user={updateProfile} setUpdateProfile={setUpdateProfile} />
      ) : (
        <CommonDatatable columns={columns} apiPoint={apiPoint} type="" />
      )}
    </>
  );
}
