import CommonDatatable from 'helpers/CommonDatatable'
import { useMemo } from 'react';
import ExportCSV from 'myComponents/ExportCSV';
import { Typography, Box, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import MainCard from 'components/MainCard';

export default function ActiveMemberRewards() {
  const apiPoint = 'get-all-incomes'

  // Active member reward tiers
  const rewardTiers = [
    { directReferrals: 5, teamSize: 20, reward: 90 },
    { directReferrals: 10, teamSize: 50, reward: 200 },
    { directReferrals: 15, teamSize: 100, reward: 500 },
    { directReferrals: 20, teamSize: 200, reward: 1000 },
    { directReferrals: 25, teamSize: 500, reward: 2500 }
  ];

  const columns = useMemo(
    () => [
      {
        header: 'User ID',
        accessorKey: 'user_id',
        cell: (props) => {
          const value = props.getValue();
          return value || 'N/A';
        }
      },
      {
        header: 'Type',
        accessorKey: 'type',
        cell: (props) => {
          return 'Active Member Reward';
        }
      },
      {
        header: 'Direct Referrals',
        accessorKey: 'extra.directReferrals',
        cell: (props) => {
          return props.getValue() || 0;
        }
      },
      {
        header: 'Team Size',
        accessorKey: 'extra.teamSize',
        cell: (props) => {
          return props.getValue() || 0;
        }
      },
      {
        header: 'Reward Tier',
        accessorKey: 'extra.rewardTier',
        cell: (props) => {
          const tier = props.getValue() || 1;
          return `Tier ${tier}`;
        }
      },
      {
        header: 'Reward Amount',
        accessorKey: 'amount',
        cell: (props) => {
          const value = props.getValue() || 0;
          return `$${parseFloat(value).toFixed(2)}`;
        }
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (props) => {
          const value = props.getValue() || 'pending';
          return value.charAt(0).toUpperCase() + value.slice(1);
        }
      },
      {
        header: 'Date',
        accessorKey: 'created_at',
        cell: (props) => {
          const value = props.getValue();
          return value ? new Date(value).toLocaleString() : 'N/A';
        },
        enableColumnFilter: true,
        enableGrouping: true
      }
    ],
    []
  );

  return (
    <>
    
      <CommonDatatable columns={columns} apiPoint={apiPoint} type={"active_member_reward"} />
    </>
  )
}