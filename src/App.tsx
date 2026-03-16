import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ConsentProvider } from './context/ConsentContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingGearButton from './components/FloatingGearButton';
import Home from './pages/Home';
import Search from './pages/Search';
import BookingDetail from './pages/BookingDetail';
import Contact from './pages/Contact';
import Confirmation from './pages/Confirmation';

function App() {
  return (
    <ConsentProvider>
      <Router>
        <div className="min-h-screen flex flex-col" data-theme="light">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/booking/:mode/:id" element={<BookingDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/confirmation" element={<Confirmation />} />
            </Routes>
          </main>
          <Footer />
          <FloatingGearButton />
          <Toaster 
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </ConsentProvider>
  );
}

export default App;
