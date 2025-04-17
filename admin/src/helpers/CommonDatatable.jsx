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
import { Box, Divider, Alert, CircularProgress } from '@mui/material';

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
import { fetchWithRetry } from 'utils/axiosRetry';
import { generateIncomeReportCacheKey } from 'utils/apiCache';

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

export default function ReactTable({ apiPoint, type, columns, noQueryStrings, team, refreshData }) {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const top = false;

  const changeToSingleDimension = async (data) => {
    try {
      let list = []
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
          list.push({ level: i, _id: data[i][j].id, ...data[i][j] })
        }
      }
      return list
    } catch (error) {
      console.error(error)
      return [];
    }
  }

  const fetchReports = async (page) => {
    setLoading(true);
    setError(null);

    try {
      // Generate cache key
      const cacheKey = generateIncomeReportCacheKey(apiPoint, type, page);

      // Prepare URL with query parameters
      let queryStrings = noQueryStrings ? "" : `?page=${page}&type=${type}`;
      const url = `/${apiPoint}${queryStrings}`;

      // Fetch data with retry and caching
      const response = await fetchWithRetry(url, {}, cacheKey);

      // Debug the response structure
      console.log('API Response:', response);

      if (!response?.status) {
        console.error('Invalid response structure:', response);
        setError('Invalid response from server');
        setLoading(false);
        return;
      }

      if (noQueryStrings) {
        let responseData = response?.result;
        console.log('Response data (noQueryStrings):', responseData);
        if (team) {
          responseData = await changeToSingleDimension(responseData);
        }
        setData(responseData || []);
        setLoading(false);
      } else {
        // Add new data to existing data
        const listData = response?.result?.list || [];
        console.log('List data:', listData);

        setData((old) => [...old, ...listData]);

        // Only fetch next page if we haven't reached the total pages
        const totalPages = parseInt(response?.result?.totalPages || 0);
        if (page < totalPages) {
          fetchReports(page + 1);
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError(error.message || 'Failed to load data. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Clear existing data before fetching new data
    setData([]);
    fetchReports(1);
  }, [apiPoint, type, refreshData]); // Refresh when apiPoint, type, or refreshData changes

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
    <MainCard content={false}>
      <Stack direction="row" spacing={3} alignItems="center" justifyContent="space-between" sx={{ padding: 2 }}>
        <DebouncedInput
          value={globalFilter ?? ''}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Search ${data.length} records...`}
        />
        <CSVExport {...{ data: table.getRowModel().rows.map((d) => d.original), headers, filename: 'report.csv' }} />
      </Stack>

      {error && (
        <Box sx={{ p: 2 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
            <Box sx={{ mt: 1 }}>
              <strong>Tip:</strong> If you're seeing rate limit errors, please wait a few minutes before trying again.
            </Box>
          </Alert>
        </Box>
      )}

      <ScrollX>
        {loading && data.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 5 }}>
            <CircularProgress />
            <Box sx={{ ml: 2 }}>Loading data...</Box>
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    <TableCell key={'#'}>#</TableCell>
                    {headerGroup.headers.map((header) => (
                      <TableCell key={header.id} {...header.column.columnDef.meta}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup, index) => (
                  <TableRow key={headerGroup.id}>
                    <TableCell key={index}></TableCell>
                    {headerGroup.headers.map((header) => (
                      <TableCell key={header.id} {...header.column.columnDef.meta}>
                        {header.column.getCanFilter() && <Filter column={header.column} table={table} />}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {loading && data.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={table.getAllColumns().length + 1} sx={{ textAlign: 'center', py: 2 }}>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Loading more data...
                    </TableCell>
                  </TableRow>
                )}
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell key={index}>{index + 1}</TableCell>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={table.getAllColumns().length + 1}>
                      <EmptyTable msg={loading ? 'Loading data...' : 'No Data'} />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {!top && data.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <TablePagination
                {...{
                  setPageSize: table.setPageSize,
                  setPageIndex: table.setPageIndex,
                  getState: table.getState,
                  getPageCount: table.getPageCount
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

ReactTable.propTypes = {
  columns: PropTypes.array,
  apiPoint: PropTypes.string.isRequired,
  type: PropTypes.number,
  noQueryStrings: PropTypes.bool,
  team: PropTypes.bool,
  refreshData: PropTypes.any // Any value that changes to trigger a refresh
};
