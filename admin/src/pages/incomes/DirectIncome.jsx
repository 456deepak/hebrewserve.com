import CommonDatatable from 'helpers/CommonDatatable'
import { useMemo } from 'react';
import ExportCSV from 'myComponents/ExportCSV';
import { Typography, Box, Grid, Card, CardContent } from '@mui/material';
import MainCard from 'components/MainCard';

export default function DirectIncome() {
  const apiPoint = 'get-all-incomes'

  // Direct referral bonus rates
  const referralRates = [
    { level: '1st Level', rate: '10%' },
    { level: '2nd Level', rate: '5%' },
    { level: '3rd Level', rate: '3%' }
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
          return 'Direct Referral Bonus';
        }
      },
      {
        header: 'Referred User',
        accessorKey: 'user_id_from',
        cell: (props) => {
          const value = props.getValue();
          return value || 'N/A';
        }
      },
      {
        header: 'Referral Level',
        accessorKey: 'level',
        cell: (props) => {
          const level = props.getValue() || 1;
          return `Level ${level}`;
        }
      },
      {
        header: 'Investment Amount',
        accessorKey: 'extra.investmentAmount',
        cell: (props) => {
          const value = props.getValue() || 0;
          return `$${parseFloat(value).toFixed(2)}`;
        }
      },
      {
        header: 'Bonus Amount',
        accessorKey: 'amount',
        cell: (props) => {
          const value = props.getValue() || 0;
          return `$${parseFloat(value).toFixed(2)}`;
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
      
      <CommonDatatable columns={columns} apiPoint={apiPoint} type={"referral_bonus"} />
    </>
  )
}