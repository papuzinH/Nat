import AdminBlogEditor from '@/screens/admin/AdminBlogEditor'

export default async function AdminBlogEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <AdminBlogEditor id={id} />
}
