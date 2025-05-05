import PropTypes from 'prop-types';
// material-ui
import Stack from '@mui/material/Stack';

// project-import
import DebouncedInput from './DebouncedInput';

// assets
import { Minus } from 'iconsax-react';

// ==============================|| FILTER - NUMBER FIELD ||============================== //

function NumberInput({ columnFilterValue, getFacetedMinMaxValues, setFilterValue }) {
  const minOpt = getFacetedMinMaxValues()?.[0];
  const min = Number(minOpt ?? '');

  const maxOpt = getFacetedMinMaxValues()?.[1];
  const max = Number(maxOpt);

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <DebouncedInput
        type="number"
        value={columnFilterValue?.[0] ?? ''}
        onFilterChange={(value) => setFilterValue((old) => [value, old?.[1]])}
        placeholder={`Min ${minOpt ? `(${min})` : ''}`}
        fullWidth
        inputProps={{ min: min, max: max }}
        size="small"
        startAdornment={false}
      />
      <Minus size="32" color="#FF8A65" variant="Outline" />
      <DebouncedInput
        type="number"
        value={columnFilterValue?.[1] ?? ''}
        onFilterChange={(value) => setFilterValue((old) => [old?.[0], value])}
        placeholder={`Max ${maxOpt ? `(${max})` : ''}`}
        fullWidth
        inputProps={{ min: min, max: max }}
        size="small"
        startAdornment={false}
      />
    </Stack>
  );
}

// ==============================|| FILTER - TEXT FIELD ||============================== //

function TextInput({ columnId, columnFilterValue, header, setFilterValue }) {
  const dataListId = columnId + 'list';

  return (
    <DebouncedInput
      type="text"
      fullWidth
      value={columnFilterValue ?? ''}
      onFilterChange={(value) => setFilterValue(value)}
      placeholder={`Search ${header}`}
      inputProps={{ list: dataListId }}
      size="small"
      startAdornment={false}
    />
  );
}

// ==============================|| FILTER - INPUT ||============================== //

// Utility function to safely access nested values
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && typeof acc === 'object' ? acc[key] : undefined), obj);
}

export default function Filter({ column, table }) {
  const firstRow = table?.getPreFilteredRowModel()?.flatRows[0];
  const columnId = column.id;

  const firstValue = columnId.includes('.')
    ? getNestedValue(firstRow?.original, columnId)
    : firstRow?.getValue(columnId);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === 'number' ? (
    <NumberInput
      columnFilterValue={columnFilterValue}
      getFacetedMinMaxValues={column.getFacetedMinMaxValues}
      setFilterValue={column.setFilterValue}
    />
  ) : (
    <TextInput
      columnId={columnId}
      columnFilterValue={columnFilterValue}
      setFilterValue={column.setFilterValue}
      header={column.columnDef.header}
    />
  );
}

// ==============================|| PROP TYPES ||============================== //

NumberInput.propTypes = {
  columnFilterValue: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
  getFacetedMinMaxValues: PropTypes.func,
  setFilterValue: PropTypes.func
};

TextInput.propTypes = {
  columnId: PropTypes.string,
  columnFilterValue: PropTypes.string,
  header: PropTypes.string,
  setFilterValue: PropTypes.func
};

Filter.propTypes = {
  column: PropTypes.object,
  table: PropTypes.object
};
