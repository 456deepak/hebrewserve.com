
import { useMemo, useState, useEffect } from 'react';
import axios from 'utils/axios';
import CommonDatatable from 'helpers/CommonDatatable';
import { Button } from '@mui/material';
import ExportCSV from 'myComponents/ExportCSV';
import { openSnackbar } from 'api/snackbar';

export default function DailyTask() {
  const [reload, setReload] = useState(false); // State to trigger data reload
  const apiPoint = 'get-daily-task-data';

  // Function to handle login request
  const logInUser = async (user_id) => {
    if (!user_id) return;
    const res = await axios.post('/user-login-request', { user_id });
    if (res.status === 200) {
      window.open(res.data?.result.url);
    } else {
      openSnackbar({
        open: true,
        message: res.data.msg,
        variant: 'alert',
        alert: {
          color: 'error',
        },
      });
    }
  };
  const handleApproveAll = async () => {
    try {
        // Fetch all user data (if not already available in state)
        const { data } = await axios.get('/get-daily-task-data2'); // Replace with your API endpoint for fetching data
      
        // Extract user IDs from the data
        const userIds = data.result.map((user) => user._id);
        console.log(userIds)
        if (userIds.length === 0) {
            openSnackbar({
                open: true,
                message: 'No tasks to approve',
                variant: 'alert',
                alert: {
                    color: 'warning',
                },
            });
            return;
        }

        // Send all user IDs to the approveAll endpoint
        const response = await axios.post('/approveAllSocial', { userIds });
  
        if (response.status === 200) {
            openSnackbar({
                open: true,
                message: 'All Tasks Approved',
                variant: 'alert',
                alert: {
                    color: 'success',
                },
            });
            setReload((prev) => !prev); // Reload data
        }
    } catch (error) {
        openSnackbar({
            open: true,
            message: 'Approve All Failed',
            variant: 'alert',
            alert: {
                color: 'error',
            },
        });
    }
};

  
  // Function to handle task approval
  const handleApprove = async (user_id) => {
    try {
      const response = await axios.post('/approveSocial', { user_id });
      if (response.status === 200) {
        openSnackbar({
          open: true,
          message: 'Task Approved',
          variant: 'alert',
          alert: {
            color: 'success',
          },
        });
        setReload((prev) => !prev); // Toggle reload state
      }
    } catch (error) {
      openSnackbar({
        open: true,
        message: 'Approval Failed',
        variant: 'alert',
        alert: {
          color: 'error',
        },
      });
    }
  };

  // Function to handle task rejection
  const handleReject = async (user_id) => {
    try {
      const response = await axios.post('/rejectSocial', { user_id });
      if (response.status === 200) {
        openSnackbar({
          open: true,
          message: 'Task Rejected',
          variant: 'alert',
          alert: {
            color: 'success',
          },
        });
        setReload((prev) => !prev); // Toggle reload state
      }
    } catch (error) {
      openSnackbar({
        open: true,
        message: 'Rejection Failed',
        variant: 'alert',
        alert: {
          color: 'error',
        },
      });
    }
  };

  // Define the columns with action buttons
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
        header: 'Name',
        accessorKey: 'name',
      },
      {
        header: 'Facebook Url',
        accessorKey: 'extra',
        cell: (props) => {
          const facebookUrl = props.getValue()?.facebookUrl;
          return facebookUrl ? (
            <a style={{color:"#fff"}} href={facebookUrl} target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
          ) : (
            'Not Provided'
          );
        },
      },
      {
        header: 'Twitter Url',
        accessorKey: 'extra',
        cell: (props) => {
          const xUrl = props.getValue()?.xUrl;
          return xUrl ? (
            <a style={{color:"#fff"}}  href={xUrl} target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
          ) : (
            'Not Provided'
          );
        },
      },
      {
        header: 'Instagram Url',
        accessorKey: 'extra',
        cell: (props) => {
          const instagramUrl = props.getValue()?.instagramUrl;
          return instagramUrl ? (
            <a style={{color:"#fff"}}  href={instagramUrl} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          ) : (
            'Not Provided'
          );
        },
      },
      {
        header: 'Linkedin Url',
        accessorKey: 'extra',
        cell: (props) => {
          const linkedinUrl = props.getValue()?.linkedinUrl;
          return linkedinUrl ? (
            <a style={{color:"#fff"}}  href={linkedinUrl} target="_blank" rel="noopener noreferrer">
              Linkedin
            </a>
          ) : (
            'Not Provided'
          );
        },
      },
      {
        header: 'Actions',
        accessorKey: '',
        id: 'actions',
        cell: (props) => {
          const { status } = props.row.original.extra || {}; // Get user.extra.status
          return status ? (
            <div style={{ textAlign: 'center', color: 'green', fontWeight: 'bold' }}>
              Approved
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleApprove(props.row.original._id)}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleReject(props.row.original._id)}
                style={{ marginLeft: 10 }}
              >
                Reject
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <>
   <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
   <ExportCSV type="dailytask" />
      <Button
          variant="contained"
          color="primary"
          onClick={handleApproveAll}
          style={{marginBottom:'20px'}}
        >
          Approve All
        </Button>
   </div>
      <CommonDatatable columns={columns} apiPoint={apiPoint} reload={reload} /> {/* Pass reload state */}
    </>
  );
}
