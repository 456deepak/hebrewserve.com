import CommonDatatable from 'helpers/CommonDatatable'
import { useMemo } from 'react';

export default function ROI() {

    const apiPoint = 'get-all-fund-deducts'

    const columns = useMemo(
        () => [
            {
                header: 'User ID',
                accessorKey: 'user_id'
            },
            {
                header: 'Wallet Type',
                accessorKey: 'type'
            },
            {
                header: 'Amount',
                accessorKey: 'amount'
            },
            {
                header: 'Remark',
                accessorKey: 'remark'
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

    return <CommonDatatable columns={columns} apiPoint={apiPoint} type={1} />
}