import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

function HomePage() {
  const { user } = useSelector((state) => state.auth)

  return (
    <div className="flex flex-col items-center">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Namma Vivasayi</h1>
        <p className="text-xl max-w-2xl mx-auto">
          Connecting farmers from 6 villages directly to city consumers. Fresh produce from farm to table.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mb-12">
        <div className="card">
          <h2 className="text-2xl font-bold mb-4 text-primary-600">For Farmers</h2>
          <p className="mb-6">
            Register your produce, track your contributions, and connect directly with city consumers.
          </p>
          {user && user.role === 'farmer' ? (
            <Link to="/farmer-dashboard" className="btn btn-primary block text-center">
              Go to Farmer Dashboard
            </Link>
          ) : (
            <Link to="/register" className="btn btn-primary block text-center">
              Register as Farmer
            </Link>
          )}
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-4 text-primary-600">For Customers</h2>
          <p className="mb-6">
            Browse available produce from all villages, place orders, and support local farmers.
          </p>
          <Link to="/customer-portal" className="btn btn-primary block text-center">
            Browse Produce
          </Link>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-4 text-primary-600">For Admins</h2>
          <p className="mb-6">
            Manage villages, farmers, and inventory. Track the supply chain from farm to city.
          </p>
          {user && user.role === 'admin' ? (
            <Link to="/admin-dashboard" className="btn btn-primary block text-center">
              Go to Admin Dashboard
            </Link>
          ) : (
            <span className="text-gray-500 block text-center">Admin access required</span>
          )}
        </div>
      </section>

      <section className="w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 text-primary-800 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
            <h3 className="text-xl font-semibold mb-2">Farmers Register Produce</h3>
            <p>Farmers from 6 villages register their crops and quantities in the system.</p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 text-primary-800 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
            <h3 className="text-xl font-semibold mb-2">Central Inventory</h3>
            <p>All produce is aggregated in a central inventory system for easy tracking.</p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 text-primary-800 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
            <h3 className="text-xl font-semibold mb-2">City Users Order</h3>
            <p>City users browse available produce and place orders directly from farmers.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage