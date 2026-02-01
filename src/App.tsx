import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
  RouterProvider,
} from '@tanstack/react-router';
import { Header } from './components/layout/header';
import { ThemeProvider } from './components/theme/theme-provider';
import { fetchComedy } from './data/fetchComedy';
import { City } from './routes/city';
import { Home } from './routes/home';
import { MapPage } from './routes/map';

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Outlet />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

// 1. OLD ROUTE REDIRECT (Optional but recommended)
const legacyMapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/melbourne/map',
  loader: () => {
    throw redirect({
      to: '/$country/$city/map',
      params: { country: 'au', city: 'melbourne' },
    });
  },
});

const legacyListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/melbourne',
  loader: () => {
    throw redirect({
      to: '/$country/$city',
      params: { country: 'au', city: 'melbourne' },
    });
  },
});

// 2. NEW DYNAMIC ROUTES
const cityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$country/$city',
  component: City,
  loader: async ({ params }) => {
    await queryClient.ensureQueryData({
      queryKey: ['comedy', params.country, params.city],
      queryFn: () => fetchComedy(params.country, params.city),
    });
  },
});

const mapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$country/$city/map', // The new standard structure
  component: MapPage,
  loader: async ({ params }) => {
    await queryClient.ensureQueryData({
      queryKey: ['comedy', params.country, params.city],
      queryFn: () => fetchComedy(params.country, params.city),
    });
  },
});

// 3. Register Routes
const routeTree = rootRoute.addChildren([
  indexRoute,
  cityRoute,
  mapRoute,
  legacyListRoute,
  legacyMapRoute,
]);

const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="dead-funny-club-theme">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;