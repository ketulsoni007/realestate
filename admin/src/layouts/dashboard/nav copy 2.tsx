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
import { ExpandLess, ExpandMore, StarBorder, ChevronRight } from '@mui/icons-material';
import { Collapse, List, ListItemIcon } from '@mui/material';

// ----------------------------------------------------------------------

export type NavContentProps = {
  data: {
    path?: string; // Make path optional here
    title: string;
    icon: React.ReactNode;
    info?: React.ReactNode;
    id: number;
    children: any;
  }[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  workspaces: WorkspacesPopoverProps['data'];
  sx?: SxProps<Theme>;
};

export function NavDesktop({
  sx,
  data,
  slots,
  workspaces,
  layoutQuery,
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
      <NavContent data={data} slots={slots} workspaces={workspaces} />
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
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
      <NavContent data={data} slots={slots} workspaces={workspaces} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------
const initialOpenMenus = [0];

export function NavContent({ data, slots, workspaces, sx }: NavContentProps) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<number[]>(initialOpenMenus);

  useEffect(() => {
    // Initialize an array to store active menu IDs
    const activeMenuIds = new Set<number>();

    // Check for active menus
    data.forEach((item) => {
      // Check if the current pathname matches the item's path or starts with it
      const isActive = item.path === pathname || pathname.startsWith(`${item.path}/`);

      if (isActive) {
        activeMenuIds.add(item.id); // Add parent menu id if it is active
      }

      // Check if any of the children are active
      if (item.children?.some((child: any) => child.path === pathname || pathname.startsWith(`${child.path}/`))) {
        activeMenuIds.add(item.id); // Add parent menu id if any child is active
      }
    });

    // Update state with active menu IDs
    setOpenMenus((prev) => [...new Set([...prev, ...activeMenuIds])]);
  }, [pathname, data]);

  const toggleSubMenu = (id: number) => {
    setOpenMenus((prevOpenMenus) =>
      prevOpenMenus.includes(id)
        ? prevOpenMenus.filter((menuId) => menuId !== id)
        : [...prevOpenMenus, id]
    );
  };

  return (
    <>
      <Logo />
      {slots?.topArea}
      <Scrollbar fillContent sx={{ my: 2 }}>
        <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={sx}>
          <Box component="ul" gap={0.5} display="flex" flexDirection="column">
            {data.map((item, index) => {
              const isActive = item.path === pathname;
              const childrenActivated = item?.children?.some(
                (child: any) => child.path === pathname || pathname.startsWith(`${child.path}/`)
              );

              return (
                <ListItem disableGutters disablePadding key={item.id}>
                  {item.children && item.children.length > 0 ? (
                    <Box sx={{ width: '100%' }}>
                      {/* Parent item */}
                      <ListItemButton
                        disableGutters
                        component={RouterLink}
                        href={item.path || '#'}
                        onClick={() => toggleSubMenu(item.id)}
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
                          {item.icon}
                        </Box>
                        <Box component="span" flexGrow={1}>
                          {item.title}
                        </Box>
                        {openMenus.includes(item.id) ? <ExpandMore /> : <ChevronRight />}
                      </ListItemButton>

                      {/* Children submenu */}
                      {openMenus.includes(item.id) && (
                        <Box component="ul" sx={{ mt: 0.5 }}>
                          {item.children.map((child: any, index: number) => {
                            const isChildActive = child.path === pathname || pathname.startsWith(`${child.path}/`); // Check if this child is active

                            return (
                              <ListItem
                                disableGutters
                                disablePadding
                                key={child.title}
                                sx={{ my: 0.5 }}
                              >
                                <ListItemButton
                                  disableGutters
                                  component={RouterLink}
                                  href={child.path}
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
                                      backgroundColor: 'var(--layout-nav-item-active-bg)', // Active background color for the child
                                      color: 'var(--layout-nav-item-active-color)',
                                      '&:hover': {
                                        backgroundColor: 'var(--layout-nav-item-hover-bg)',
                                      },
                                    }),
                                  }}
                                >
                                  <Box component="span" sx={{ width: 24, height: 24 }}>
                                    {child.icon}
                                  </Box>
                                  <Box component="span" flexGrow={1}>
                                    {child.title}
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
                      href={item.path || '#'}
                      sx={{
                        pl: 2,
                        py: 1,
                        gap: 2,
                        pr: 1.5,
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
                        {item.icon}
                      </Box>
                      <Box component="span" flexGrow={1}>
                        {item.title}
                      </Box>
                      {item.info && item.info}
                    </ListItemButton>
                  )}
                </ListItem>
              );
            })}
          </Box>
        </Box>
      </Scrollbar>
      {slots?.bottomArea}
    </>
  );
}
