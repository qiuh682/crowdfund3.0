import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Web3Provider } from './context/Web3Context';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import CreateProject from './pages/CreateProject';
import Dashboard from './pages/Dashboard';
import DeploymentGuide from './pages/DeploymentGuide';

function App() {
  return (
    <Web3Provider>
      <BrowserRouter>
        <div style={{ 
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#F5F5F5',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Header />
          
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/create" element={<CreateProject />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/deploy" element={<DeploymentGuide />} />
            </Routes>
          </main>
          
          <Footer />
          
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                padding: '16px',
                borderRadius: '8px',
              },
              success: {
                iconTheme: {
                  primary: '#4CAF50',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#F44336',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </BrowserRouter>
    </Web3Provider>
  );
}

export default App;