import { CryptoDashboard } from './components/CryptoDashboard';

export default function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)',
      padding: '20px'
    }}>
      <CryptoDashboard />
    </div>
  );
}