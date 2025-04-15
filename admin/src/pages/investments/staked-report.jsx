import { Chip } from '@mui/material';
import CommonDatatable from 'helpers/CommonDatatable'
import { useMemo } from 'react';

export default function ROI() {

  const apiPoint = 'get-all-stacked'

  const columns = useMemo(
    () => [
      {
        header: 'User ID',
        accessorKey: 'user_id'
      },
      {
        header: 'Type',
        accessorKey: 'type',
        cell: (props) => {
          return <Chip color={props.getValue() === 1 ? "success" : "error"} label={props.getValue() === 1 ? "STACKED" : "INACTIVE"} size="small" />
        },
      },
      {
        header: 'Stacked ICO Token',
        accessorKey: 'amount'
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (props) => {
          return <Chip color={props.getValue() === 1 ? "success" : "error"} label={props.getValue() === 1 ? "ACTIVE" : "INACTIVE"} size="small" />
        },
      },
      {
        header: 'Date',
        accessorKey: 'created_at',
        // meta: { className: 'cell-right' }
        cell: (props) => {
          return new Date(props.getValue()).toLocaleString();
        },
        enableColumnFilter: false,
        enableGrouping: false
      }
    ],
    []
  );

  return <CommonDatatable columns={columns} apiPoint={apiPoint} />
}