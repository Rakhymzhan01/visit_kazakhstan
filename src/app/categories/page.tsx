import Header from '../components/Header'
import Footer from '../components/Footer'

export default function CategoriesPage() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Categories</h1>
        <p className="text-gray-600">Browse travel categories in Kazakhstan.</p>
      </div>
      <Footer />
    </>
  )
}