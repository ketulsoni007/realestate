import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { varAlpha } from 'src/theme/styles';
import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import { NavUpgrade } from '../components/nav-upgrade';
import { WorkspacesPopover } from '../components/workspaces-popover';
import type { WorkspacesPopoverProps } from '../components/workspaces-popover';
import { ExpandLess, ExpandMore, ChevronRight } from '@mui/icons-material';
import { Collapse, List, ListItemIcon, Skeleton } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Flag as FlagIcon,
  Public as PublicIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
  Lock as LockIcon,
  Error as ErrorIcon,
  LocationCity as LocationCityIcon,
  Place as PlaceIcon,
  Article as ArticleIcon,
  Balcony as BalconyIcon,
  Apartment as ApartmentIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  LockPerson as LockPersonIcon,
} from '@mui/icons-material';
// ----------------------------------------------------------------------

const iconMapping: Record<string, React.ElementType> = {
  DashboardIcon,
  PeopleIcon,
  FlagIcon,
  PublicIcon,
  HomeIcon,
  PersonIcon,
  ShoppingCartIcon,
  LockIcon,
  ErrorIcon,
  LocationCityIcon,
  PlaceIcon,
  ArticleIcon,
  BalconyIcon,
  ApartmentIcon,
  ViewModuleIcon,
  ViewListIcon,
  LockPersonIcon,
};

// ----------------------------------------------------------------------

const icon = (iconName: string) => {
  const IconComponent = iconMapping[iconName];
  return IconComponent ? <IconComponent /> : null;
};

// ----------------------------------------------------------------------

export type NavContentProps = {
  data: {
    route?: string; // Make path optional here
    name: string;
    icon: string; // Changed from React.ReactNode to string
    info?: React.ReactNode;
    _id: number;
    subModules: any;
  }[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  loading:boolean;
  workspaces: WorkspacesPopoverProps['data'];
  sx?: SxProps<Theme>;
};

export function NavDesktop({
  sx,
  data,
  slots,
  workspaces,
  layoutQuery,
  loading,
}: NavContentProps & { layoutQuery: Breakpoint }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        bgcolor: 'var(--layout-nav-bg)',
        zIndex: 'var(--layout-nav-zIndex)',
        width: 'var(--layout-nav-vertical-width)',
        borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)})`,
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <NavContent data={data} loading={loading} slots={slots} workspaces={workspaces} />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
  workspaces,
  loading,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!open) {
      onClose();
    }
  }, [pathname, open, onClose]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          bgcolor: 'var(--layout-nav-bg)',
          width: 'var(--layout-nav-mobile-width)',
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots} loading={loading} workspaces={workspaces} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function NavContent({ data, slots, loading, workspaces, sx }: NavContentProps) {
  const pathname = usePathname();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  useEffect(() => {
    const activeSubModule = data.flatMap(item => item.subModules || []).find((child: any) => child.route === pathname);
    const activeMenu = activeSubModule ? data.find(item => item.subModules?.includes(activeSubModule)) : null;
    setOpenMenuId(activeMenu ? activeMenu._id : null);
  }, [pathname, data]);

  const toggleSubMenu = (id: number) => {
    setOpenMenuId((prevId) => (prevId === id ? null : id)); // Toggle only the clicked menu
  };

  return (
    <>
      <Logo />
      {slots?.topArea}
      <Scrollbar fillContent sx={{ my: 2 }}>
        <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={sx}>
          <Box component="ul" gap={0.5} display="flex" flexDirection="column">
            {loading ? (
              // Render skeletons if loading
              Array.from({ length: 10 }).map((_, index) => (
                <ListItem disableGutters disablePadding key={index}>
                  <ListItemButton disableGutters sx={{ pl: 2, py: 1 }}>
                    <Skeleton variant="rectangular" height={'30px'} width="100%" />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              // Render actual nav items when not loading
              data.map((item) => {
                const isActive = item.route === pathname;
                const childrenActivated = item.subModules?.some((child: any) => child.route === pathname || pathname.startsWith(`${child.route}/`));
                
                return (
                  <ListItem disableGutters disablePadding key={item._id}>
                    {item.subModules && item.subModules.length > 0 ? (
                      <Box sx={{ width: '100%' }}>
                        <ListItemButton
                          disableGutters
                          component={RouterLink}
                          href={item.route || '#'}
                          onClick={() => toggleSubMenu(item._id)}
                          sx={{
                            pl: 2,
                            py: 1,
                            gap: 2,
                            pr: 1.5,
                            width: '100%',
                            borderRadius: 0.75,
                            typography: 'body2',
                            fontWeight: 'fontWeightMedium',
                            color: 'var(--layout-nav-item-color)',
                            minHeight: 'var(--layout-nav-item-height)',
                            ...(childrenActivated && {
                              fontWeight: 'fontWeightSemiBold',
                              bgcolor: 'var(--layout-nav-item-active-bg)',
                              color: 'var(--layout-nav-item-active-color)',
                              '&:hover': {
                                bgcolor: 'var(--layout-nav-item-hover-bg)',
                              },
                            }),
                          }}
                        >
                          <Box component="span" sx={{ width: 24, height: 24 }}>
                            {icon(item.icon)}
                          </Box>
                          <Box component="span" flexGrow={1}>
                            {item.name}
                          </Box>
                          {openMenuId === item._id ? <ExpandMore /> : <ChevronRight />}
                        </ListItemButton>

                        {openMenuId === item._id && (
                          <Box component="ul" sx={{ mt: 0.5,ml:2 }}>
                            {item.subModules.map((child: any) => {
                              const isChildActive = child.route === pathname || pathname.startsWith(`${child.route}/`);

                              return (
                                <ListItem disableGutters disablePadding key={child._id} sx={{ my: 0.5 }}>
                                  <ListItemButton
                                    disableGutters
                                    component={RouterLink}
                                    href={child.route}
                                    sx={{
                                      position: 'relative',
                                      pl: 2,
                                      py: 1,
                                      gap: 2,
                                      pr: 1.5,
                                      borderRadius: 0.75,
                                      typography: 'body2',
                                      fontWeight: 'fontWeightMedium',
                                      color: 'var(--layout-nav-item-color)',
                                      minHeight: 'var(--layout-nav-item-height)',
                                      ...(isChildActive && {
                                        fontWeight: 'fontWeightSemiBold',
                                        backgroundColor: 'var(--layout-nav-item-active-bg)',
                                        color: 'var(--layout-nav-item-active-color)',
                                        '&:hover': {
                                          backgroundColor: 'var(--layout-nav-item-hover-bg)',
                                        },
                                      }),
                                    }}
                                  >
                                    <Box component="span" sx={{ width: 24, height: 24 }}>
                                      {icon(child.icon)}
                                    </Box>
                                    <Box component="span" flexGrow={1}>
                                      {child.name}
                                    </Box>
                                  </ListItemButton>
                                </ListItem>
                              );
                            })}
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <ListItemButton
                        disableGutters
                        component={RouterLink}
                        href={item.route || '#'}
                        sx={{
                          pl: 2,
                          py: 1,
                          gap: 2,
                          pr: 1.5,
                          width: '100%',
                          borderRadius: 0.75,
                          typography: 'body2',
                          fontWeight: 'fontWeightMedium',
                          color: 'var(--layout-nav-item-color)',
                          minHeight: 'var(--layout-nav-item-height)',
                          ...(isActive && {
                            fontWeight: 'fontWeightSemiBold',
                            bgcolor: 'var(--layout-nav-item-active-bg)',
                            color: 'var(--layout-nav-item-active-color)',
                            '&:hover': {
                              bgcolor: 'var(--layout-nav-item-hover-bg)',
                            },
                          }),
                        }}
                      >
                        <Box component="span" sx={{ width: 24, height: 24 }}>
                          {icon(item.icon)}
                        </Box>
                        <Box component="span" flexGrow={1}>
                          {item.name}
                        </Box>
                      </ListItemButton>
                    )}
                  </ListItem>
                );
              })
            )}
          </Box>
        </Box>
      </Scrollbar>
      {slots?.bottomArea}
      {/* <NavUpgrade /> */}
    </>
  );
}

