import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';
import { Box, Divider, Alert, Skeleton } from '@mui/material';

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
import axios from 'utils/axios';
import { fetchWithRetry } from 'utils/axiosRetry';
import { generateIncomeReportCacheKey, getFromCache } from 'utils/apiCache';

export const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta(itemRank);
  return itemRank.passed;
};

export const fuzzySort = (rowA, rowB, columnId) => {
  let dir = 0;
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(rowA.columnFiltersMeta[columnId], rowB.columnFiltersMeta[columnId]);
  }
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

export default function ReactTable({ apiPoint, type, columns, noQueryStrings, team, refreshData }) {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const changeToSingleDimension = async (data) => {
    try {
      let list = [];
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
          list.push({ level: i, _id: data[i][j].id, ...data[i][j] });
        }
      }
      return list;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const fetchAllPages = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // First page request
      let initialUrl = `/${apiPoint}${noQueryStrings ? '' : `?page=1&type=${type}`}`;
      const cacheKey = generateIncomeReportCacheKey(apiPoint, type, 1);
      
      // Try to get first page from cache
      const cachedFirstPage = getFromCache(cacheKey);
      
      // If we have cached first page, show it immediately
      if (cachedFirstPage) {
        let initialData = noQueryStrings ? cachedFirstPage.result : cachedFirstPage.result?.list || [];
        if (team && noQueryStrings) {
          initialData = await changeToSingleDimension(initialData);
        }
        setData(initialData);
        
        // Continue with remaining pages in background
        fetchRemainingPages(cachedFirstPage, initialData);
        return;
      }
      
      // No cache, fetch first page
      const initialResponse = await fetchWithRetry(initialUrl, {}, cacheKey);
      
      if (!initialResponse?.status) {
        throw new Error('Invalid response from server');
      }
      
      let initialData = noQueryStrings ? initialResponse.result : initialResponse.result?.list || [];
      if (team && noQueryStrings) {
        initialData = await changeToSingleDimension(initialData);
      }
      
      // Show first page data immediately
      setData(initialData);
      
      // Fetch remaining pages in background
      fetchRemainingPages(initialResponse, initialData);
      
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError(error.message || 'Failed to load data.');
      setLoading(false);
    }
  };

  const fetchRemainingPages = async (initialResponse, initialData) => {
    try {
      let totalPages = noQueryStrings ? 1 : parseInt(initialResponse.result?.totalPages || 0);
      
      // If only one page, we're done
      if (totalPages <= 1) {
        setLoading(false);
        return;
      }
      
      // Fetch remaining pages in parallel
      let requests = [];
      for (let page = 2; page <= totalPages; page++) {
        const pageUrl = `/${apiPoint}?page=${page}&type=${type}`;
        const pageCacheKey = generateIncomeReportCacheKey(apiPoint, type, page);
        requests.push(fetchWithRetry(pageUrl, {}, pageCacheKey));
      }
      
      // Process pages as they complete
      const responses = await Promise.all(requests);
      let allData = [...initialData];
      
      for (let res of responses) {
        let pageData = res?.result?.list || [];
        if (team && noQueryStrings) {
          pageData = await changeToSingleDimension(pageData);
        }
        allData.push(...pageData);
      }
      
      setData(allData);
    } catch (error) {
      console.error('Error fetching remaining pages:', error);
      setError((prevError) => prevError || error.message || 'Failed to load all data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setData([]);
    fetchAllPages();
  }, [apiPoint, type, refreshData]);

  const [pageSize, setPageSize] = useState(25);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
      pagination: {
        pageSize,
        pageIndex: currentPage
      }
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: fuzzyFilter,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' 
        ? updater(table.getState().pagination) 
        : updater;
      setCurrentPage(newPagination.pageIndex);
    }
  });

  let headers = [];
  table.getAllColumns().map((columns) =>
    headers.push({
      label: typeof columns.columnDef.header === 'string' ? columns.columnDef.header : '#',
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
          <Box sx={{ p: 2 }}>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    {columns.map((col, index) => (
                      <TableCell key={index}>
                        <Skeleton variant="text" width={100} />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...Array(5)].map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Skeleton variant="text" width={20} />
                      </TableCell>
                      {columns.map((_, index) => (
                        <TableCell key={index}>
                          <Skeleton variant="text" width="80%" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
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
                    <TableCell colSpan={table.getAllColumns().length + 1}>
                      <Skeleton variant="rectangular" height={40} />
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

        {data.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <TablePagination
                {...{
                  setPageSize: (size) => {
                    const allowed = [25, 50, 100, 250];
                    if (!allowed.includes(size)) size = allowed[0];
                    setPageSize(size);
                    table.setPageSize(size);
                  },
                  setPageIndex: (index) => {
                    setCurrentPage(index);
                    table.setPageIndex(index);
                  },
                  getState: table.getState,
                  getPageCount: table.getPageCount,
                  rowsPerPageOptions: [25, 50, 100, 250]
                }}
              />
            </Box>
          </>
        )}
      </ScrollX>
    </MainCard>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  apiPoint: PropTypes.string.isRequired,
  type: PropTypes.number,
  noQueryStrings: PropTypes.bool,
  team: PropTypes.bool,
  refreshData: PropTypes.any
};
