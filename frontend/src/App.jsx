import { Routes, Route } from 'react-router-dom'
import './styles/catalog.css'
import './styles/features.css'
import './styles/polish.css' // espaciados, collage y detalles de pulido
import './styles/custom.css' // diseños van aqui
import { AdvisorProvider } from './context/AdvisorContext.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import AdvisorWidget from './components/AdvisorWidget.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Blog from './pages/Blog.jsx'
import ArticleDetail from './pages/ArticleDetail.jsx'
import Careers from './pages/Careers.jsx'
import CareerDetail from './pages/CareerDetail.jsx'
import Institutions from './pages/Institutions.jsx'
import Financing from './pages/Financing.jsx'
import Admissions from './pages/Admissions.jsx'
import Library from './pages/Library.jsx'
import Wellbeing from './pages/Wellbeing.jsx'
import Faq from './pages/Faq.jsx'
import Test from './pages/Test.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import NotFound from './pages/NotFound.jsx'
import AdminLayout from './admin/AdminLayout.jsx'
import AdminDashboard from './admin/AdminDashboard.jsx'
import ResourcePage from './admin/ResourcePage.jsx'

export default function App() {
  return (
    <AdvisorProvider>
      <div className="app">
        <Navbar />
        <main className="container main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/carreras" element={<Careers />} />
            <Route path="/carreras/:slug" element={<CareerDetail />} />
            <Route path="/instituciones" element={<Institutions />} />
            <Route path="/financiacion" element={<Financing />} />
            <Route path="/admisiones" element={<Admissions />} />
            <Route path="/biblioteca" element={<Library />} />
            <Route path="/bienestar" element={<Wellbeing />} />
            <Route path="/preguntas-frecuentes" element={<Faq />} />
            <Route path="/test-vocacional" element={<Test />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<ArticleDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />

            <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path=":resource" element={<ResourcePage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <AdvisorWidget />
      </div>
    </AdvisorProvider>
  )
}
