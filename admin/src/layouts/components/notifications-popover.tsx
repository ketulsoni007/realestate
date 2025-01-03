import type { IconButtonProps } from '@mui/material/IconButton';

import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import { fToNow } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { useAppDispatch, useAppSelector } from 'src/store';
import { notificationCountApi, notificationListApi } from 'src/store/Slices/commonSlice';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { CommonGradientSpinner } from 'src/components/InputFields/field';
import { config } from 'src/config-global';
// ----------------------------------------------------------------------

type NotificationItemProps = {
  id: string;
  type: string;
  title: string;
  isUnRead: boolean;
  description: string;
  avatarUrl: string | null;
  postedAt: string | number | null;
};

export type NotificationsPopoverProps = IconButtonProps & {
  data?: NotificationItemProps[];
};

export function NotificationsPopover({ data = [], sx, ...other }: NotificationsPopoverProps) {
  const [notifications, setNotifications] = useState(data);
  const dispatch = useAppDispatch();
  const notificationCount = useAppSelector((state)=>state.common.isNotificatioCount);
  const isNotificatioList = useAppSelector((state)=>state.common.isNotificatioList);
  const isApiStatus = useAppSelector((state)=>state.common.isApiStatus);
  const notificationListLoading = isApiStatus?.notificationListApi === 'loading';

  const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const target = event.currentTarget;
    dispatch(notificationListApi({})).then(() => {
      setOpenPopover(target);
    });
  }, [dispatch, setOpenPopover]);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      isUnRead: false,
    }));

    setNotifications(updatedNotifications);
  }, [notifications]);

  useEffect(()=>{
    dispatch(notificationCountApi({}));
  },[]);

  return (
    <>
      <IconButton
        color={openPopover ? 'primary' : 'default'}
        onClick={handleOpenPopover}
        sx={sx}
        {...other}
      >
        <Badge badgeContent={notificationListLoading ? <CommonGradientSpinner size={15}/> : notificationCount ?? 0} color={notificationListLoading ? 'default' : 'error'}>
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              width: 360,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        <Box display="flex" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {notificationCount} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="solar:check-read-outline" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar fillContent sx={{ minHeight: 240, maxHeight: { xs: 360, sm: 'none' } }}>
          <List
            disablePadding
            // subheader={
            //   <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
            //     New
            //   </ListSubheader>
            // }
          >
            {isNotificatioList.map((notification:any,index:number) => (
              <NotificationItem key={index} notification={notification} />
            ))}
          </List>

          {/* <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Before that
              </ListSubheader>
            }
          >
            {notifications.slice(2, 5).map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </List> */}
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple color="inherit">
            View all
          </Button>
        </Box>
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

function NotificationItem({ notification }: { notification: any }) {
  const userAvatarUrl = notification?.user?.profile_picture ? `${config?.IMAGE_URL}/user/${notification?.user?.profile_picture}` : '';
  console.log('userAvatarUrl: ', userAvatarUrl);
  const { title } = renderContent(notification);

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(!(notification.isRead) && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }} src={userAvatarUrl}/>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              gap: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify width={14} icon="solar:clock-circle-outline" />
            {fToNow(notification.createdAt)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification: any) {
  console.log('notificationC: ', notification);

  // Construct a dynamic title based on the inquiry type
  const inquiryMessage = (() => {
    switch (notification?.inquiry) {
      case 'visit':
        return `${notification?.user ? notification?.user?.first_name + " " + notification?.user?.last_name : notification?.name} wants to visit ${notification?.property?.title}`;
      case 'contact':
        return `${notification?.user ? notification?.user?.first_name + " " + notification?.user?.last_name : notification?.name} wants to contact you regarding ${notification?.property?.title}`;
      case 'detail':
        return `${notification?.user ? notification?.user?.first_name + " " + notification?.user?.last_name : notification?.name} is asking for details about ${notification?.property?.title}`;
      default:
        return 'You have a new notification';
    }
  })();

  // Title with inquiry and description
  const title = (
    <Typography variant="subtitle2">
      {inquiryMessage}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary',display:'block' }}>
        {notification?.property.address?.street}
      </Typography>
    </Typography>
  );

  return {
    title,
  };
}
