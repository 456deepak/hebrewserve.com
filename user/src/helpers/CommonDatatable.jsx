import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

// material-ui
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';

// third-party
import {
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  flexRender,
  useReactTable,
  sortingFns,
  getPaginationRowModel
} from '@tanstack/react-table';
import { compareItems, rankItem } from '@tanstack/match-sorter-utils';

// project import
import makeData from 'data/react-table';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { CSVExport, DebouncedInput, EmptyTable, Filter, TablePagination } from 'components/third-party/react-table';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';
import axios from 'utils/axios';
import { Box, Divider } from '@mui/material';

export const fuzzyFilter = (row, columnId, value, addMeta) => {
  // rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // store the ranking info
  addMeta(itemRank);

  // return if the item should be filtered in/out
  return itemRank.passed;
};

export const fuzzySort = (rowA, rowB, columnId) => {
  let dir = 0;

  // only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(rowA.columnFiltersMeta[columnId], rowB.columnFiltersMeta[columnId]);
  }

  // provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

// ==============================|| REACT TABLE ||============================== //

export default function ReactTable({ apiPoint, type, columns, noQueryStrings, team }) {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const [data, setData] = useState([])

  const top = false;

  const changeToSingleDimension = async (data) => {

    try {

      let list = []

      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
          list.push({ level: i, _id: data[i][j].id, ...data[i][j] })
        }
      }

      console.log(list)
      return list

    } catch (error) {
      console.log(error)
    }

  }

  const fetchReports = async (page) => {
    let queryStrings = noQueryStrings ? "" : `?page=${page}&type=${type}`

    try {
        console.log(apiPoint)
        const res = await axios.get(`/${apiPoint}${queryStrings}`);
        console.log("data", res.data)
        if (!res.data?.status) return;

        if (noQueryStrings) {
            let data = res.data?.result
            if (team) {
                data = await changeToSingleDimension(data)
            }
            setData(data)
        } else {
            // Add new data to existing data
            setData((old) => [...old, ...res.data?.result.list]);

            // Only fetch next page if we haven't reached the total pages
            if (page < parseInt(res.data?.result.totalPages)) {
                fetchReports(page + 1)
            }
        }
    } catch (error) {
        console.error('Error fetching reports:', error);
    }
  }

  useEffect(() => {
    fetchReports(1)
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters, globalFilter },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: fuzzyFilter,
    // rowCount,
    // initialState: {
    //   pagination
    // },
    // pageCount
  });

  let headers = [];
  table.getAllColumns().map((columns) =>
    headers.push({
      label: typeof columns.columnDef.header === 'string' ? columns.columnDef.header : '#',
      // @ts-ignore
      key: columns.columnDef.accessorKey
    })
  );

  return (
    <MainCard
      content={false}
      sx={{
        bgcolor: 'grey.900',
        '& .MuiCardHeader-root': {
          bgcolor: 'grey.900'
        }
      }}
    >
      <Stack
        direction="row"
        spacing={3}
        alignItems="center"
        justifyContent="space-between"
        sx={{
          padding: 2,
          bgcolor: 'grey.900',
          borderBottom: '1px solid',
          borderColor: 'grey.800'
        }}
      >
        <DebouncedInput
          value={globalFilter ?? ''}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Search ${data.length} records...`}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'grey.800',
              color: 'common.white',
              '& fieldset': {
                borderColor: 'common.white',
                borderWidth: '1.5px',
              },
              '&:hover fieldset': {
                borderColor: 'primary.main'
              },
              '& input::placeholder': {
                color: 'grey.500'
              }
            }
          }}
        />
        <CSVExport {...{ data: table.getRowModel().rows.map((d) => d.original), headers, filename: 'report.csv' }} />
      </Stack>

      <ScrollX>
        <TableContainer
          component={Paper}
          sx={{
            bgcolor: 'grey.900',
            '& .MuiPaper-root': {
              bgcolor: 'grey.900'
            }
          }}
        >
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  sx={{
                    bgcolor: 'grey.800',
                    '& th': {
                      color: 'common.white',
                      borderBottom: '1px solid',
                      borderColor: 'grey.700'
                    }
                  }}
                >
                  <TableCell key={'#'} sx={{ color: 'common.white' }}>#</TableCell>
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      {...header.column.columnDef.meta}
                      sx={{ color: 'common.white' }}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup, index) => (
                <TableRow
                  key={headerGroup.id}
                  sx={{
                    bgcolor: 'grey.800',
                    '& th': {
                      borderBottom: '1px solid',
                      borderColor: 'grey.700'
                    }
                  }}
                >
                  <TableCell key={index}></TableCell>
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id} {...header.column.columnDef.meta}>
                      {header.column.getCanFilter() && (
                        <Filter
                          column={header.column}
                          table={table}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              bgcolor: 'grey.800',
                              color: 'common.white',
                              '& fieldset': {
                                borderColor: 'grey.700'
                              },
                              '&:hover fieldset': {
                                borderColor: 'primary.main'
                              }
                            }
                          }}
                        />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      bgcolor: 'grey.900',
                      '&:hover': {
                        bgcolor: 'grey.800',
                        transition: 'all 0.2s ease'
                      },
                      '& td': {
                        color: 'common.white',
                        borderBottom: '1px solid',
                        borderColor: 'grey.800'
                      }
                    }}
                  >
                    <TableCell key={index} sx={{ color: 'common.white' }}>{index + 1}</TableCell>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        {...cell.column.columnDef.meta}
                        sx={{ color: 'common.white' }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    sx={{
                      color: 'grey.500',
                      textAlign: 'center',
                      py: 3
                    }}
                  >
                    <EmptyTable msg="No Data" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {!top && (
          <>
            <Divider sx={{ borderColor: 'grey.800' }} />
            <Box sx={{ p: 2, bgcolor: 'grey.900' }}>
              <TablePagination
                {...{
                  setPageSize: table.setPageSize,
                  setPageIndex: table.setPageIndex,
                  getState: table.getState,
                  getPageCount: table.getPageCount
                }}
                sx={{
                  '& .MuiSelect-select': {
                    color: 'common.white',
                    bgcolor: 'grey.800'
                  },
                  '& .MuiTablePagination-displayedRows': {
                    color: 'common.white'
                  },
                  '& .MuiTablePagination-actions': {
                    '& button': {
                      color: 'common.white'
                    }
                  }
                }}
              />
            </Box>
          </>
        )}
      </ScrollX>
    </MainCard>
  );
}

// FilteringTable.propTypes = { getValue: PropTypes.func };

ReactTable.propTypes = { columns: PropTypes.array, data: PropTypes.array };
