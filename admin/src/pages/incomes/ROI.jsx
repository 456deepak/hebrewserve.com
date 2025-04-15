import CommonDatatable from 'helpers/CommonDatatable'
import { useMemo } from 'react';
import ExportCSV from 'myComponents/ExportCSV';
import { Typography, Box } from '@mui/material';
import MainCard from 'components/MainCard';

export default function ROI() {
  const apiPoint = 'get-all-incomes'

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
          return 'Daily Trading Profit';
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
        header: 'Daily Profit Rate',
        accessorKey: 'extra.profitRate',
        cell: (props) => {
          const value = props.getValue() || 2.5;
          return `${value}%`;
        }
      },
      {
        header: 'Profit Amount',
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
      
        <ExportCSV type="daily-trading-profit" />
    
      <CommonDatatable columns={columns} apiPoint={apiPoint} type={"daily_profit"} />
    </>
  )
}