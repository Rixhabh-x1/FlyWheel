import { useEffect, useState } from 'react'
import { useWallet } from '../hooks/useWallet'
import { hasContractAddresses } from '../config/contracts'
import { getOwnedNFTs } from '../services/api'
import { BrowserProvider, Contract, parseEther } from 'ethers'
import { CONTRACT_ADDRESSES } from '../config/contracts'
import nftABI from '../contracts/nftABI.json'
import { getEthereumProvider } from '../utils/blockchain'
import mintPreview from '../assets/nfts/nftimg1.png'
import { getNftImage } from '../data/nftDisplay'

function MyNFTs() {
  const wallet = useWallet()
  const canMint = wallet.isConnected &&wallet.isCorrectNetwork  && Boolean(CONTRACT_ADDRESSES.nft)
  const [nfts, setNfts] = useState([])

  useEffect(() => {
    if (!wallet.address) {
      setNfts([])
      return
    }

    const loadNFTs = async () => {
      try {
        const data = await getOwnedNFTs(wallet.address)
        setNfts(data.nfts)
      } catch (error) {
        console.error('NFT loading error:', error)
      }
    }

    loadNFTs()
  }, [wallet.address])

  const rarityName = (rarity) => {
    if (rarity === 1) return 'Common'
    if (rarity === 2) return 'Rare'
    if (rarity === 3) return 'Epic'
    return `Level ${rarity}`
  }
  const [minting, setMinting] = useState(false)

async function mintNFT() {
  if (minting) return

  try {
    setMinting(true)

    const provider = new BrowserProvider(getEthereumProvider())
    const signer = await provider.getSigner()

    const nftContract = new Contract(
      CONTRACT_ADDRESSES.nft,
      nftABI,
      signer
    )

    const tx = await nftContract.mint({
      value: parseEther('0.001')
    })

    await tx.wait()

    alert('NFT minted successfully!')
    window.location.reload()
  } catch (error) {
    console.error('Mint error:', error)
  } finally {
    setMinting(false)
  }
}

  return (
    <div className="container inner-page">
      <header className="page-header">
        <div>
          <span>Collection vault</span>
          <h1>My NFTs</h1>
          <p>Mint, collect, fuse and grow your Flywheel collection.</p>
        </div>

        <div className="page-header__badge">
          Mint price <strong>0.001 ETH</strong>
        </div>
      </header>

      <section className="mint-panel">
        <div className="mint-panel__visual">
          <img src={mintPreview} alt="FLYwheel mechanical bird NFT" />
        </div>

        <div className="mint-panel__copy">
          <span>mint</span>
          <h2>Begin your flywheel</h2>
          <p>Create your Flywheel NFT and start building your collection.</p>

         {!wallet.isConnected ? (
  <button
    className="button"
    type="button"
    onClick={wallet.connect}
  >
    Connect wallet
  </button>
) : !wallet.isCorrectNetwork ? (
  <button
    className="button"
    type="button"
    onClick={wallet.switchNetwork}
  >
    Switch to Robinhood Testnet
  </button>
) : (
  <button
    className="button"
    type="button"
    onClick={mintNFT}
    disabled={!canMint || minting}
  >
    {minting ? 'Minting...' : 'Mint for 0.001 ETH'}
  </button>
)}
              
          
        </div>
      </section>

      <section className="collection-section">
        <div className="section-heading">
          <div>
            <span>Connected inventory</span>
            <h2>Your collection</h2>
          </div>
        </div>

        {!wallet.isConnected ? (
          <div className="empty-state">
            <h3>Connect your wallet</h3>
            <p>Your NFTs will appear here.</p>
          </div>
        ) : nfts.length === 0 ? (
          <div className="empty-state">
            <h3>No NFTs found</h3>
            <p>Mint or acquire an NFT to start your collection.</p>
          </div>
        ) : (
          <div className="nft-grid">
            {nfts.map((nft) => (
              <article className="nft-card" key={nft.tokenId}>
                <img src={getNftImage(nft.rarity)} alt={`Flywheel NFT #${nft.tokenId}`} />
                <h3>Flywheel NFT #{nft.tokenId}</h3>
                <p>{rarityName(nft.rarity)}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default MyNFTs