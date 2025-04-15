import CommonDatatable from 'helpers/CommonDatatable'
import { useMemo } from 'react';

export default function ROI() {

    const apiPoint = 'get-all-deposits'

    const columns = useMemo(
        () => [
            {
                header: 'User ID',
                accessorKey: 'user_id'
            },
            {
                header: 'Wallet Type',
                accessorKey: 'wallet_type'
            },
            {
                header: 'BNB',
                accessorKey: 'amount'
            },
            {
                header: 'in USDT',
                accessorKey: 'amount_coin',
                case: (props) => {
                    return props?.row?.original.status === 2 ? props.getValue() : ''
                }
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