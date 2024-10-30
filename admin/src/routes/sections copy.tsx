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

// Render fallback for lazy loading
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

const checkPermissions = (permissions: any[], permission_type: string, id: string) => {
  const permission = permissions.find((perm) => perm.module === id);
  if (!permission) return false;
  switch (permission_type) {
    case 'list':
      return permission.can_view;
    case 'add':
      return permission.can_create;
    case 'edit':
      return permission.can_edit;
    default:
      return false;
  }
}

// Router configuration
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
        // { path: 'property', element: <PropertyPage /> },
        // { path: 'property/add', element: <PropertyAddPage /> },
        // { path: 'property/edit/:id', element: <PropertyEditPage /> }, 
        {
          path: 'property',
          element: checkPermissions(isPermissionList.permissions, 'list','670e12b21a64707b3c723adf') ? <PropertyPage /> : <Navigate to="/forbidden" replace />,
        },
        {
          path: 'property/add',
          element: checkPermissions(isPermissionList.permissions, 'add','670e12b21a64707b3c723adf') ? <PropertyAddPage /> : <Navigate to="/forbidden" replace />,
        },
        {
          path: 'property/edit/:id',
          element: checkPermissions(isPermissionList.permissions, 'edit','670e12b21a64707b3c723adf') ? <PropertyEditPage /> : <Navigate to="/forbidden" replace />,
        },
        { path: 'country', element: <CountryPage /> },
        { path: 'country/add', element: <CountryAddPage /> },
        { path: 'country/edit/:id', element: <CountryEditPage /> }, 
        { path: 'state', element: <StatePage /> },
        { path: 'state/add', element: <StateAddPage /> },
        { path: 'state/edit/:id', element: <StateEditPage /> }, 
        { path: 'city', element: <CityPage /> },
        { path: 'city/add', element: <CityAddPage /> },
        { path: 'city/edit/:id', element: <CityEditPage /> }, 
        { path: 'module', element: <ModulePage /> },
        { path: 'module/add', element: <ModuleAddPage /> },
        { path: 'module/edit/:id', element: <ModuleEditPage /> }, 
        { path: 'submodule', element: <SubModulePage /> },
        { path: 'submodule/add', element: <SubModuleAddPage /> },
        { path: 'submodule/edit/:id', element: <SubModuleEditPage /> }, 
        { path: 'permission', element: <PermissionPage /> }, 
        { path: 'area', element: <AreaPage /> },
        { path: 'area/add', element: <AreaAddPage /> },
        { path: 'area/edit/:id', element: <AreaEditPage /> }, 
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
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
