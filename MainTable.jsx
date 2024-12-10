import { useState } from 'react';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';

import PaginationActions from './PaginationActions';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const MainTable = ({
  columns,
  rows,
  totalCount,
  onSortChange,
  onFilterChange,
  onPageChange,
  onPageSizeChange,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  rows = rows ?? [];

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  // Table Callbacks.
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (onPageChange) {
      onPageChange(newPage);
    }
  };
  const handleChangeRowsPerPage = (event) => {
    const pageSize = parseInt(event.target.value);
    setRowsPerPage(pageSize);
    setPage(0);
    if (onPageSizeChange) {
      onPageSizeChange(pageSize);
    }
  };
  const handleSortChange = (column) => {
    if (onSortChange) {
      onSortChange(column);
    }
  };
  const handleFilterChange = (column, value) => {
    if (onFilterChange) {
      onFilterChange(column, value);
    }
  };

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
      <Table stickyHeader sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <StyledTableCell align={col.align ?? 'left'} key={col.id ?? col.value}>
                {col.value}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length > 0 && rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
            <StyledTableRow key={rowIndex}>
              {columns.map((col, colIndex) => (
                <StyledTableCell key={colIndex}>{row[col.key]}</StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
          {rows.length == 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6}>
                No data found.
              </TableCell>
            </TableRow>
          )}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              count={totalCount ?? 0}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: false,
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={PaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default MainTable;
