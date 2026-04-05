import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Catalog from './pages/Catalog.tsx';
import AnimeDetail from './pages/AnimeDetail.tsx';
import WatchUrl from './pages/WatchUrl.tsx';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';

// A simple layout wrapper that includes the Navbar and Footer
const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - var(--header-height) - 100px)', paddingTop: 'var(--header-height)' }}>
        {children}
      </main>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/anime/*" element={<AnimeDetail />} />
          <Route path="/watch/*" element={<WatchUrl />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
