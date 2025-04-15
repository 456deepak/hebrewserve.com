import CommonDatatable from 'helpers/CommonDatatable'
import { useMemo } from 'react';

export default function ROI() {

  const apiPoint = 'get-all-incomes'

  const columns = useMemo(
    () => [
      // Removed User ID column as we're only showing the current user's data
      {
        header: 'Income Type',
        accessorKey: 'extra.income_type'
      },
      // {
      //   header: 'Level',
      //   accessorKey: 'extra.level'
      // },
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

  return <CommonDatatable columns={columns} apiPoint={apiPoint} type={3} />
}