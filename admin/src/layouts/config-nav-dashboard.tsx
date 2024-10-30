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
} from '@mui/icons-material';
import { Label } from 'src/components/label';
// ----------------------------------------------------------------------

const icon = (IconComponent: any) => <IconComponent />;

export const navData = [
  {
    id: 1,
    title: 'Dashboard',
    path: '/',
    icon: icon(DashboardIcon),
    children: [],
  },
  {
    id: 2,
    title: 'Role Management',
    icon: icon(PeopleIcon),
    children: [
      {
        title: 'Module',
        path: '/module',
        icon: icon(ViewModuleIcon),
      },
      {
        title: 'Sub Module',
        path: '/submodule',
        icon: icon(ViewListIcon),
      },
    ],
  },
  {
    id: 3,
    title: 'Regional Management',
    icon: icon(PublicIcon),
    children: [
      {
        title: 'Country',
        path: '/country',
        icon: icon(FlagIcon),
      },
      {
        title: 'State',
        path: '/state',
        icon: icon(BalconyIcon),
      },
      {
        title: 'City',
        path: '/city',
        icon: icon(LocationCityIcon),
      },
      {
        title: 'Area',
        path: '/area',
        icon: icon(PlaceIcon),
      },
    ],
  },
  {
    id: 4,
    title: 'Property',
    path: '/property',
    icon: icon(ApartmentIcon),
    children: [],
  },
  {
    id: 5,
    title: 'User',
    path: '/user',
    icon: icon(PersonIcon),
    children: [],
  },
  {
    id: 6,
    title: 'Product',
    path: '/products',
    icon: icon(ShoppingCartIcon),
    info: (
      <Label color="error" variant="inverted">
        +3
      </Label>
    ),
    children: [],
  },
  {
    id: 7,
    title: 'Blog',
    path: '/blog',
    icon: icon(ArticleIcon),
    children: [],
  },
  // {
  //   id: 8,
  //   title: 'Sign in',
  //   path: '/signIn',
  //   icon: icon(LockIcon),
  //   children: [],
  // },
  // {
  //   id: 9,
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon(ErrorIcon),
  //   children: [],
  // },
];
