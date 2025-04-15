import CommonDatatable from 'helpers/CommonDatatable'
import { useMemo } from 'react';

export default function ROI() {

    const apiPoint = 'get-user-downline'

    const columns = useMemo(
        () => [
            {
                header: 'User ID',
                accessorKey: 'trace_id'
            },
            {
                header: 'Identifier',
                accessorKey: 'username'
            },
            // {
            //     header: 'Position',
            //     accessorKey: 'position',
            //     cell: (props) => {
            //         return props.getValue() === 'L' ? "Left" : "Right"
            //     },
            // },
            {
                header: 'Phone Number',
                accessorKey: 'phone_number'
            },
            {
                header: 'Investments',
                accessorKey: 'total_investment'
            },
            {
                header: 'Level',
                accessorKey: 'level'
            },
            {
                header: 'Wallet',
                accessorKey: 'wallet'
            },
            // {
            //     header: 'Topup Wallet',
            //     accessorKey: 'wallet_topup'
            // },
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

    return <CommonDatatable columns={columns} apiPoint={apiPoint} noQueryStrings={true} team={true} />
}