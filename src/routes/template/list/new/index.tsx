import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/template/list/new/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/template/list/new/"!</div>
}
