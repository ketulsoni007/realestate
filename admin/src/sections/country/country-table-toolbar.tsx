import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { Iconify } from 'src/components/iconify';
import { countryDeleteApi, countryListApi } from 'src/store/Slices/countrySlice';
import { useAppDispatch } from 'src/store';
import { toastNotificationAdmin } from 'src/components/CustomToastAdmin/CustomToastAdmin';
import useSweetAlert from 'src/hooks/use-swal-alert';
import useConfirmation from 'src/hooks/use-confirmation-modal';
import ConfirmationModal from 'src/components/modal/ConfirmationModal';


// ----------------------------------------------------------------------

type CountryTableToolbarProps = {
  numSelected: number;
  filterName: string;
  selected: string[];
  page: any;
  rowsPerPage: any;
  table:any;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function CountryTableToolbar({
  table,
  numSelected,
  selected,
  filterName,
  onFilterName,
  page,
  rowsPerPage,
}: CountryTableToolbarProps) {
  const dispatch = useAppDispatch();
  const { showWarning, showSuccess, showError } = useSweetAlert();
  const { showConfirmation, isOpen, title, description, confirmButtonText, showCancelButton, handleConfirm, handleCancel, } = useConfirmation();
  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <OutlinedInput
          fullWidth
          value={filterName}
          onChange={onFilterName}
          placeholder="Search country..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
          sx={{ maxWidth: 320 }}
        />
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton
            onClick={() => {
              showConfirmation({
                title: 'Confirm Deletion',
                description: `Are you sure you want to delete ${selected?.length ?? 'this'} item?`,
                confirmButtonText: 'Yes, delete it!',
              }).then((result) => {
                if (result) {
                  dispatch(countryDeleteApi({ ids: selected })).then((action) => {
                    if (action?.meta?.requestStatus === 'fulfilled') {
                      dispatch(countryListApi({ page: page, rowsPerPage: rowsPerPage }));
                      table.setSelected([]);
                      toastNotificationAdmin.success('Country deleted successfully');
                    } else if (action?.meta?.requestStatus === 'rejected') {
                      const message = action?.payload?.message ?? 'Something went wrong';
                      showError('Error!', message);
                    }
                  });
                }
              });
            }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      )}
      <ConfirmationModal
          isOpen={isOpen}
          title={title}
          description={description}
          confirmButtonText={confirmButtonText}
          showCancelButton={showCancelButton}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
    </Toolbar>
  );
}
