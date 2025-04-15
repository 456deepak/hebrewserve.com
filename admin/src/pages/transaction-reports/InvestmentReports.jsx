import { Chip } from '@mui/material';
import CommonDatatable from 'helpers/CommonDatatable'
import { useMemo } from 'react';

export default function Handler() {

    const apiPoint = 'get-all-investments'

    const columns = useMemo(
        () => [
            {
                header: 'User ID',
                accessorKey: 'user_id'
            },
            {
                header: 'Plan ID',
                accessorKey: 'investment_plan_id'
            },
            {
                header: 'Amount',
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
                enableColumnFilter: true,
                enableGrouping: true,
                filter: 'date'
            }
        ],
        []
    );

    return <CommonDatatable columns={columns} apiPoint={apiPoint} type={1} />
}