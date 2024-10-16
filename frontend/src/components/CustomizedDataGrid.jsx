import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { collaboratorColumns, useCollaboratorTableRows } from '../internals/data/gridData';

export default function CustomizedDataGrid() {
  const { collaboratorRows, isLoading, isError } = useCollaboratorTableRows();
  return (
    <DataGrid
      autoHeight
      checkboxSelection
      rows={collaboratorRows}
      columns={collaboratorColumns}
      getRowId={(row) => row.id || `${row.email}`}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      pageSizeOptions={[10, 20, 50]}
      disableColumnResize
      density="compact"
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: 'outlined',
              size: 'small',
            },
            columnInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            operatorInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: 'outlined',
                size: 'small',
              },
            },
          },
        },
      }}
    />
  );
}
