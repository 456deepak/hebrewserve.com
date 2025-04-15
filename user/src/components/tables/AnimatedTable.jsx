import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Typography,
  useTheme,
  alpha,
  CircularProgress,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { fadeIn, fadeInUp } from '../../utils/animations';
import { EmptyWallet } from 'iconsax-react';

// Styled components
const TableWrapper = styled(Paper)(({ theme, delay = 0 }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  opacity: 0,
  animation: `${fadeIn} 0.6s ${delay}s forwards ease-out`,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
}));

const StyledTableRow = styled(TableRow)(({ theme, index = 0 }) => ({
  opacity: 0,
  animation: `${fadeInUp} 0.5s ${0.1 + (index * 0.05)}s forwards ease-out`,
  '&:nth-of-type(odd)': {
    backgroundColor: alpha(theme.palette.background.default, 0.5)
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05)
  },
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

const TableHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
}));

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(6),
  opacity: 0,
  animation: `${fadeIn} 0.6s 0.2s forwards ease-out`
}));

const AnimatedTable = ({
  title,
  columns,
  data = [],
  loading = false,
  emptyText = 'No data available',
  pagination = true,
  initialRowsPerPage = 10,
  rowsPerPageOptions = [5, 10, 25],
  sortable = true,
  initialSortBy = '',
  initialSortDirection = 'asc',
  delay = 0,
  renderRowActions,
  onRowClick,
  customCellRenderers = {},
  stickyHeader = false
}) => {
  const theme = useTheme();
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  
  // Sorting state
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortDirection, setSortDirection] = useState(initialSortDirection);
  
  // Handle pagination changes
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Handle sorting
  const handleSort = (property) => {
    const isAsc = sortBy === property && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };
  
  // Sort and paginate data
  const sortedData = React.useMemo(() => {
    if (!sortable || !sortBy) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortBy, sortDirection, sortable]);
  
  const paginatedData = pagination
    ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : sortedData;
  
  // Render cell content with custom renderers if provided
  const renderCellContent = (column, row) => {
    const { field, type } = column;
    const value = row[field];
    
    // Use custom renderer if provided
    if (customCellRenderers[field]) {
      return customCellRenderers[field](value, row);
    }
    
    // Default renderers based on type
    switch (type) {
      case 'currency':
        return `$${parseFloat(value).toFixed(2)}`;
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'datetime':
        return new Date(value).toLocaleString();
      case 'boolean':
        return value ? 'Yes' : 'No';
      case 'status':
        return (
          <Chip 
            label={value} 
            size="small"
            color={
              value === 'completed' || value === 'active' || value === 'approved' ? 'success' :
              value === 'pending' ? 'warning' :
              value === 'failed' || value === 'rejected' ? 'error' : 'default'
            }
            sx={{ fontWeight: 500 }}
          />
        );
      default:
        return value;
    }
  };

  return (
    <TableWrapper elevation={0} delay={delay}>
      {title && (
        <TableHeader>
          <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          
          {loading && (
            <CircularProgress size={24} thickness={4} />
          )}
        </TableHeader>
      )}
      
      <TableContainer sx={{ maxHeight: stickyHeader ? 440 : 'auto' }}>
        <Table stickyHeader={stickyHeader}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell 
                  key={column.field}
                  align={column.align || 'left'}
                  sx={{ 
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    backgroundColor: theme.palette.background.paper
                  }}
                  sortDirection={sortable && sortBy === column.field ? sortDirection : false}
                >
                  {sortable && column.sortable !== false ? (
                    <TableSortLabel
                      active={sortBy === column.field}
                      direction={sortBy === column.field ? sortDirection : 'asc'}
                      onClick={() => handleSort(column.field)}
                    >
                      {column.headerName}
                    </TableSortLabel>
                  ) : (
                    column.headerName
                  )}
                </TableCell>
              ))}
              
              {renderRowActions && (
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (renderRowActions ? 1 : 0)} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={40} thickness={4} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Loading data...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (renderRowActions ? 1 : 0)} align="center" sx={{ py: 6 }}>
                  <EmptyStateContainer>
                    <EmptyWallet size={48} variant="Bulk" color={theme.palette.text.secondary} />
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                      {emptyText}
                    </Typography>
                  </EmptyStateContainer>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <StyledTableRow 
                  key={row.id || index}
                  index={index}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {columns.map((column) => (
                    <TableCell 
                      key={`${row.id || index}-${column.field}`}
                      align={column.align || 'left'}
                    >
                      {renderCellContent(column, row)}
                    </TableCell>
                  ))}
                  
                  {renderRowActions && (
                    <TableCell align="right">
                      {renderRowActions(row)}
                    </TableCell>
                  )}
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {pagination && data.length > 0 && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </TableWrapper>
  );
};

AnimatedTable.propTypes = {
  title: PropTypes.string,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired,
      align: PropTypes.oneOf(['left', 'center', 'right']),
      type: PropTypes.oneOf(['string', 'number', 'currency', 'date', 'datetime', 'boolean', 'status']),
      sortable: PropTypes.bool
    })
  ).isRequired,
  data: PropTypes.array,
  loading: PropTypes.bool,
  emptyText: PropTypes.string,
  pagination: PropTypes.bool,
  initialRowsPerPage: PropTypes.number,
  rowsPerPageOptions: PropTypes.array,
  sortable: PropTypes.bool,
  initialSortBy: PropTypes.string,
  initialSortDirection: PropTypes.oneOf(['asc', 'desc']),
  delay: PropTypes.number,
  renderRowActions: PropTypes.func,
  onRowClick: PropTypes.func,
  customCellRenderers: PropTypes.object,
  stickyHeader: PropTypes.bool
};

export default AnimatedTable;
