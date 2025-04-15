import React from 'react'
import { Table } from 'antd'

function CommomTable({ dataSource, columns, ...rest }) {
  return (
    <>
      <Table dataSource={dataSource} columns={columns} {...rest} />
    </>
  )
}

export default CommomTable
