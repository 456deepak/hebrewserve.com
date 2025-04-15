import CommonDatatable from 'helpers/CommonDatatable'
import { useMemo } from 'react';

export default function ROI() {

  const apiPoint = 'get-all-incomes'

  const columns = useMemo(
    () => [
      {
        header: 'User ID',
        accessorKey: 'user_id'
      },
      {
        header: 'From',
        accessorKey: 'user_id_from'
      },
      {
        header: 'Amount',
        accessorKey: 'amount'
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

  return <CommonDatatable columns={columns} apiPoint={apiPoint} type={5} />
}