import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import PrivateRoute from '../Guard/PrivateRoute';
import PublicRoute from '../Guard/PublicRoute';
import { useAppSelector } from 'src/store';

// Lazy loading pages
const HomePage = lazy(() => import('src/pages/home'));
const BlogPage = lazy(() => import('src/pages/blog'));
const UserPage = lazy(() => import('src/pages/user'));

const PropertyPage = lazy(() => import('src/pages/Property/property'));
const PropertyAddPage = lazy(() => import('src/pages/Property/propert-add'));
const PropertyEditPage = lazy(() => import('src/pages/Property/property-edit'));

const CountryPage = lazy(() => import('src/pages/RegionalManageMent/Country/country'));
const CountryAddPage = lazy(() => import('src/pages/RegionalManageMent/Country/country-add'));
const CountryEditPage = lazy(() => import('src/pages/RegionalManageMent/Country/country-edit'));

const StatePage = lazy(() => import('src/pages/RegionalManageMent/State/state'));
const StateAddPage = lazy(() => import('src/pages/RegionalManageMent/State/state-add'));
const StateEditPage = lazy(() => import('src/pages/RegionalManageMent/State/state-edit'));

const CityPage = lazy(() => import('src/pages/RegionalManageMent/City/city'));
const CityAddPage = lazy(() => import('src/pages/RegionalManageMent/City/city-add'));
const CityEditPage = lazy(() => import('src/pages/RegionalManageMent/City/city-edit'));

const ModulePage = lazy(() => import('src/pages/RoleManageMent/Module/module'));
const ModuleAddPage = lazy(() => import('src/pages/RoleManageMent/Module/module-add'));
const ModuleEditPage = lazy(() => import('src/pages/RoleManageMent/Module/module-edit'));

const SubModulePage = lazy(() => import('src/pages/RoleManageMent/SubModule/sub-module'));
const SubModuleAddPage = lazy(() => import('src/pages/RoleManageMent/SubModule/sub-module-add'));
const SubModuleEditPage = lazy(() => import('src/pages/RoleManageMent/SubModule/sub-module-edit'));

const PermissionPage = lazy(() => import('src/pages/RoleManageMent/permission/permission'));

const AreaPage = lazy(() => import('src/pages/RegionalManageMent/Area/area'));
const AreaAddPage = lazy(() => import('src/pages/RegionalManageMent/Area/area-add'));
const AreaEditPage = lazy(() => import('src/pages/RegionalManageMent/Area/area-edit'));

const SignInPage = lazy(() => import('src/pages/sign-in'));
const ForgotPasswordPage = lazy(() => import('src/pages/forgot-password'));
const ProductsPage = lazy(() => import('src/pages/products'));
const Page404 = lazy(() => import('src/pages/page-not-found'));
const ForbiddenIllustration = lazy(() => import('src/pages/forbidden-access'));

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

const checkPermissions = (permissions: any[], permission_type: string, id: string,subModuleId:any) => {
  const permission = permissions && permissions?.find((perm) => perm.module._id === id);
  if (!permission && !['submoduleList', 'submoduleAdd', 'submoduleEdit'].includes(permission_type)) {
    return false;
  }
  switch (permission_type) {
    case 'list':
      return permission.can_view;
    case 'add':
      return permission.can_create;
    case 'edit':
      return permission.can_edit;
    case 'submoduleList':
        return permission && permission.submodule?.some((sub: any) => sub.submodule._id === subModuleId && sub.can_view) || false;
    case 'submoduleAdd':
        return permission && permission.submodule?.some((sub: any) => sub.submodule._id === subModuleId && sub.can_create) || false;
    case 'submoduleEdit':
        return permission && permission.submodule?.some((sub: any) => sub.submodule._id === subModuleId && sub.can_edit) || false;
    default:
      return false;
  }
}

export function Router() {
  const isPermissionList = useAppSelector((state: any) => state.common.isPermissionList);
  return useRoutes([
    {
      element: (
        <PrivateRoute>
          <DashboardLayout>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </PrivateRoute>
      ),
      children: [
        { element: <HomePage />, index: true },
        {
          path: 'property',
          element: checkPermissions(isPermissionList.permissions, 'list','670e12b21a64707b3c723adf',null) ? <PropertyPage /> : <Navigate to="/forbidden" replace />,
        },
        {
          path: 'property/add',
          element: checkPermissions(isPermissionList.permissions, 'add','670e12b21a64707b3c723adf',null) ? <PropertyAddPage /> : <Navigate to="/forbidden" replace />,
        },
        {
          path: 'property/edit/:id',
          element: checkPermissions(isPermissionList.permissions, 'edit','670e12b21a64707b3c723adf',null) ? <PropertyEditPage /> : <Navigate to="/forbidden" replace />,
        },
        {
          path: 'country',
          element: checkPermissions(isPermissionList.permissions, 'submoduleList','670e14051a64707b3c723af3', '670e4213da27c9eb2e0b1dc2') ? <CountryPage /> : <Navigate to="/forbidden" replace />,
        },
        {
          path: 'country/add',
          element: checkPermissions(isPermissionList.permissions, 'submoduleAdd', '670e14051a64707b3c723af3','670e4213da27c9eb2e0b1dc2') ? <CountryAddPage /> : <Navigate to="/forbidden" replace />,
        },
        {
          path: 'country/edit/:id',
          element: checkPermissions(isPermissionList.permissions, 'submoduleEdit','670e14051a64707b3c723af3', '670e4213da27c9eb2e0b1dc2') ? <CountryEditPage /> : <Navigate to="/forbidden" replace />,
        },
        {
          path: 'state',
          element: checkPermissions(isPermissionList.permissions, 'submoduleList','670e14051a64707b3c723af3', '670e423eda27c9eb2e0b1dd0') ? <StatePage /> : <Navigate to="/forbidden" replace />,
        },
        {
          path: 'state/add',
          element: checkPermissions(isPermissionList.permissions, 'submoduleAdd', '670e14051a64707b3c723af3','670e423eda27c9eb2e0b1dd0') ? <StateAddPage /> : <Navigate to="/forbidden" replace />,
        },
        {
          path: 'state/edit/:id',
          element: checkPermissions(isPermissionList.permissions, 'submoduleEdit','670e14051a64707b3c723af3', '670e423eda27c9eb2e0b1dd0') ? <StateEditPage /> : <Navigate to="/forbidden" replace />,
        },
        {
          path: 'city',
          element: checkPermissions(isPermissionList.permissions, 'submoduleList','670e14051a64707b3c723af3', '670e425eda27c9eb2e0b1dde') ? <CityPage /> : <Navigate to="/forbidden" replace />,
        },
        {
          path: 'city/add',
          element: checkPermissions(isPermissionList.permissions, 'submoduleAdd', '670e14051a64707b3c723af3','670e425eda27c9eb2e0b1dde') ? <CityAddPage /> : <Navigate to="/forbidden" replace />,
        },
        {
          path: 'city/edit/:id',
          element: checkPermissions(isPermissionList.permissions, 'submoduleEdit','670e14051a64707b3c723af3', '670e425eda27c9eb2e0b1dde') ? <CityEditPage /> : <Navigate to="/forbidden" replace />,
        },
        {
          path: 'area',
          element: checkPermissions(isPermissionList.permissions, 'submoduleList','670e14051a64707b3c723af3', '670e4281da27c9eb2e0b1dec') ? <AreaPage /> : <Navigate to="/forbidden" replace />,
        },
        {
          path: 'area/add',
          element: checkPermissions(isPermissionList.permissions, 'submoduleAdd', '670e14051a64707b3c723af3','670e4281da27c9eb2e0b1dec') ? <AreaAddPage /> : <Navigate to="/forbidden" replace />,
        },
        {
          path: 'area/edit/:id',
          element: checkPermissions(isPermissionList.permissions, 'submoduleEdit','670e14051a64707b3c723af3', '670e4281da27c9eb2e0b1dec') ? <AreaEditPage /> : <Navigate to="/forbidden" replace />,
        },
        {
          path: 'module',
          element: checkPermissions(isPermissionList.permissions, 'submoduleList','670e13ad1a64707b3c723ae9', '670e4003e5702538cd85c2e5') ? <ModulePage /> : <Navigate to="/forbidden" replace />,
        },
        {
          path: 'module/add',
          element: checkPermissions(isPermissionList.permissions, 'submoduleAdd', '670e13ad1a64707b3c723ae9','670e4003e5702538cd85c2e5') ? <ModuleAddPage /> : <Navigate to="/forbidden" replace />,
        },
        {
          path: 'module/edit/:id',
          element: checkPermissions(isPermissionList.permissions, 'submoduleEdit','670e13ad1a64707b3c723ae9', '670e4003e5702538cd85c2e5') ? <ModuleEditPage /> : <Navigate to="/forbidden" replace />,
        },
        {
          path: 'submodule',
          element: checkPermissions(isPermissionList.permissions, 'submoduleList','670e13ad1a64707b3c723ae9', '670e4003e5702538cd85c2e5') ? <SubModulePage /> : <Navigate to="/forbidden" replace />,
        },
        {
          path: 'submodule/add',
          element: checkPermissions(isPermissionList.permissions, 'submoduleAdd', '670e13ad1a64707b3c723ae9','670e4003e5702538cd85c2e5') ? <SubModuleAddPage /> : <Navigate to="/forbidden" replace />,
        },
        {
          path: 'submodule/edit/:id',
          element: checkPermissions(isPermissionList.permissions, 'submoduleEdit','670e13ad1a64707b3c723ae9', '670e4003e5702538cd85c2e5') ? <SubModuleEditPage /> : <Navigate to="/forbidden" replace />,
        },
        {
          path: 'permission',
          element: checkPermissions(isPermissionList.permissions, 'submoduleList','670e13ad1a64707b3c723ae9', '670e5d3745fd983e8f825d65') ? <PermissionPage /> : <Navigate to="/forbidden" replace />,
        },
        {
          path: 'user',
          element: checkPermissions(isPermissionList.permissions, 'list','670e14211a64707b3c723afd', null) ? <UserPage /> : <Navigate to="/forbidden" replace />,
        },
        {
          path: 'products',
          element: checkPermissions(isPermissionList.permissions, 'list','670e14471a64707b3c723b07', null) ? <ProductsPage /> : <Navigate to="/forbidden" replace />,
        },
        {
          path: 'blog',
          element: checkPermissions(isPermissionList.permissions, 'list','670e14631a64707b3c723b11', null) ? <BlogPage /> : <Navigate to="/forbidden" replace />,
        },
      ],
    },
    {
      path: 'signIn',
      element: (
        <PublicRoute>
          <AuthLayout>
            <SignInPage />
          </AuthLayout>
        </PublicRoute>
      ),
    },
    {
      path: 'forgot-password',
      element: (
        <PublicRoute>
          <AuthLayout>
            <ForgotPasswordPage />
          </AuthLayout>
        </PublicRoute>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
    {
      path: '/forbidden',
      element: <ForbiddenIllustration />,
    },
  ]);
}
