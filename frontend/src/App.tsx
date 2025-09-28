import { Toaster } from 'react-hot-toast';
import { DustAwareZKCharity } from './components/DustAwareZKCharity';
import { Layout } from './components/layout/layout';

function App() {
  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen font-sans relative overflow-x-hidden">
      {/* Animated background glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-violet-900/50 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-fuchsia-900/50 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>

      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(30, 41, 59, 0.8)',
            color: '#e2e8f0',
            border: '1px solid #334155',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
      
      {/* The entire app is wrapped in the Layout */}
      <Layout>
        <DustAwareZKCharity />
      </Layout>
    </div>
  );
}

export default App;