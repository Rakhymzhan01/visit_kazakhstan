export default async function CategoryPage({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Category: {categorySlug}</h1>
      <p className="text-gray-600">Explore destinations in this category.</p>
    </div>
  )
}