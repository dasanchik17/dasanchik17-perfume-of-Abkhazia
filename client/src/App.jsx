import OrderPage from './pages/OrderPage/OrderPage'
import AdminPage from './pages/AdminPage/AdminPage'
import { AdminRoute } from './components/ProtectedRoute/ProtectedRoute'
import LoginPage    from './pages/LoginPage/LoginPage'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import CartPage from './pages/CartPage/CartPage'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage/HomePage'
import CatalogPage from './pages/CatalogPage/CatalogPage'
import ProductPage from './pages/ProductPage/ProductPage'
import Preloader from './components/Preloader/Preloader'
import AboutPage     from './pages/AboutPage/AboutPage'
import PerfumeryPage from './pages/PerfumeryPage/PerfumeryPage'

const Stub = ({ name }) => (
    <div style={{ padding: '120px 40px', textAlign: 'center', color: '#7a7068' }}>
        Страница «{name}» — в разработке
    </div>
)

export default function App() {
    return (
    <>
      <Preloader />
      <Layout>
        <Routes>
                <Route path="/"            element={<HomePage />} />
                <Route path="/catalog"     element={<CatalogPage />} />
                <Route path="/catalog/:id" element={<ProductPage />} />
                <Route path="/about"      element={<AboutPage />} />
                <Route path="/perfumery"  element={<PerfumeryPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login"    element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/admin" element={
                    <AdminRoute>
                        <AdminPage />
                    </AdminRoute>
                } />
                <Route path="/order" element={<OrderPage />} />
            </Routes>
      </Layout>
    </>
  )
}