import { createRouter, RouterProvider, createRootRoute, Outlet, createRoute } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Home } from './routes/home'
import { Melbourne } from './routes/melbourne'
import { Header } from './components/header'

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
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App