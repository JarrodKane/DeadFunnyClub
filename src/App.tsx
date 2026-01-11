import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRootRoute, createRoute, createRouter, Outlet, RouterProvider } from '@tanstack/react-router';
import { Header } from './components/header';
import { ThemeProvider } from './components/theme-provider';
import { Home } from './routes/home';
import { Melbourne } from './routes/melbourne';
import { fetchMelbourneComedy } from './data/fetchComedy';

const queryClient = new QueryClient();
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Outlet />
    </div>
  ),
})


const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

const melbourneRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/melbourne',
  loader: async () => {
    const events = await fetchMelbourneComedy();
    return { events };
  },
  component: Melbourne,
})

const routeTree = rootRoute.addChildren([indexRoute, melbourneRoute])

const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="dead-funny-club-theme">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>

  )
}

export default App