import CommonDatatable from 'helpers/CommonDatatable'
import { useMemo } from 'react';
import ExportCSV from 'myComponents/ExportCSV';
import { Typography, Box, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import MainCard from 'components/MainCard';

export default function BoosterIncome() {
  const apiPoint = 'get-all-incomes'

  // Booster income ranks
  const boosterRanks = [
    { rank: 'ACTIVE', tradeBalance: 100, activeTeam: 5, dailyLimit: 5, boosterPercentage: 0.5, levelROI: 0.1 },
    { rank: 'PRIME', tradeBalance: 500, activeTeam: 15, dailyLimit: 10, boosterPercentage: 1, levelROI: 0.2 },
    { rank: 'VETERAN', tradeBalance: 2000, activeTeam: 30, dailyLimit: 15, boosterPercentage: 1.5, levelROI: 0.3 },
    { rank: 'ROYAL', tradeBalance: 5000, activeTeam: 50, dailyLimit: 20, boosterPercentage: 2, levelROI: 0.4 },
    { rank: 'SUPREME', tradeBalance: 10000, activeTeam: 100, dailyLimit: 25, boosterPercentage: 2.5, levelROI: 0.5 }
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
          return 'Booster Income';
        }
      },
      {
        header: 'Rank',
        accessorKey: 'extra.rank',
        cell: (props) => {
          const rank = props.getValue() || 'ACTIVE';
          return rank;
        }
      },
      {
        header: 'Trade Balance',
        accessorKey: 'extra.tradeBalance',
        cell: (props) => {
          const value = props.getValue() || 0;
          return `$${parseFloat(value).toFixed(2)}`;
        }
      },
      {
        header: 'Active Team Size',
        accessorKey: 'extra.activeTeam',
        cell: (props) => {
          return props.getValue() || 0;
        }
      },
      {
        header: 'Booster Percentage',
        accessorKey: 'extra.boosterPercentage',
        cell: (props) => {
          const value = props.getValue() || 0.5;
          return `${value}%`;
        }
      },
      {
        header: 'Booster Amount',
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
      
      <CommonDatatable columns={columns} apiPoint={apiPoint} type={"booster_income"} />
    </>
  )
}