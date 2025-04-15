import CommonDatatable from 'helpers/CommonDatatable'
import { useMemo } from 'react';
import ExportCSV from 'myComponents/ExportCSV';
import { Typography, Box, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import MainCard from 'components/MainCard';

export default function TeamRewards() {
  const apiPoint = 'get-all-incomes'

  // Team reward tiers
  const teamRewardTiers = [
    { teamDeposit: 10000, timePeriod: 30, rewardAmount: 500 },
    { teamDeposit: 25000, timePeriod: 60, rewardAmount: 1500 },
    { teamDeposit: 50000, timePeriod: 90, rewardAmount: 3500 },
    { teamDeposit: 100000, timePeriod: 120, rewardAmount: 8000 },
    { teamDeposit: 250000, timePeriod: 180, rewardAmount: 25000 }
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
          return 'Team Reward';
        }
      },
      {
        header: 'Team Deposit',
        accessorKey: 'extra.teamDeposit',
        cell: (props) => {
          const value = props.getValue() || 0;
          return `$${parseFloat(value).toFixed(2)}`;
        }
      },
      {
        header: 'Time Period',
        accessorKey: 'extra.timePeriod',
        cell: (props) => {
          const value = props.getValue() || 30;
          return `${value} days`;
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
     
      <CommonDatatable columns={columns} apiPoint={apiPoint} type={"team_reward"} />
    </>
  )
}