export default async function DestinationPage({ params }: { params: Promise<{ categorySlug: string; destinationSlug: string }> }) {
  const { categorySlug, destinationSlug } = await params
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Destination: {destinationSlug}</h1>
      <p className="text-gray-600">Category: {categorySlug}</p>
      <p className="text-gray-600">Destination details go here.</p>
    </div>
  )
}