import CommonDatatable from 'helpers/CommonDatatable'
import { useMemo } from 'react';

export default function ROI(){

    const apiPoint = 'get-all-investments'

    const columns = useMemo(
        () => [
          {
            header: 'User ID',
            accessorKey: 'user_id'
          },
          {
            header: 'Package Type',
            accessorKey: 'package_type'
          },
      
          {
            header: 'Amount',
            accessorKey: 'amount'
          },
          {
            header: 'Slot Value',
            accessorKey: 'slot_value'
            // meta: { className: 'cell-right' }
          },
          {
            header: 'Date',
            accessorKey: 'created_at',
            // meta: { className: 'cell-right' }
            cell: (props) => {
              return new Date(props.getValue()).toLocaleString();
            },
            enableColumnFilter: true,
            enableGrouping: true,
            filter: 'created_at',
            sortType: 'datetime',
            sortDescFirst: true,
          }
        ],
        []
      );

    return <CommonDatatable columns={columns} apiPoint={apiPoint} type={0} />
}