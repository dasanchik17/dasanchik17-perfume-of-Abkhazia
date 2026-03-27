import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import styles from './Layout.module.css'
import useScrollToTop from '../../hooks/useScrollToTop'

export default function Layout({ children }) {
  useScrollToTop()

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}