import { Route, Routes } from 'react-router-dom'
import {Header} from './components/Header'
import {Footer} from './components/Footer'
import Home from './pages/Home'
import MyNFTs from './pages/MyNFTs'
import Marketplace from './pages/Marketplace'
import Fuse from './pages/Fuse'
import Staking from './pages/Staking'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-nfts" element={<MyNFTs />} />
          <Route path="/fuse" element={<Fuse />} />
          <Route path="/staking" element={<Staking />} />
          <Route path="/marketplace" element={<Marketplace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
