export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Blog Post: {slug}</h1>
      <p className="text-gray-600">Blog post content goes here.</p>
    </div>
  )
}