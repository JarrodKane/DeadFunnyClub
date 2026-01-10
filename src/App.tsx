import { createRouter, RouterProvider, createRootRoute, createRoute } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Home } from './routes/home'
import { Melbourne } from './routes/melbourne'

const queryClient = new QueryClient();
const rootRoute = createRootRoute()

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
  basepath: '/'
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