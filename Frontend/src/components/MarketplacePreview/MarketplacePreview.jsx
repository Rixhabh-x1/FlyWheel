import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NFTCard from '../NFTCard'
import { previewNFTs } from '../../data/previewNFTs'
import { getMarketplaceListings } from '../../services/api'
import styles from './MarketplacePreview.module.css'

export const MarketplacePreview = () => {
  const [listings, setListings] = useState([])

  useEffect(() => {
    const loadListings = async () => {
      try {
        const data = await getMarketplaceListings()

        setListings(
          data.listings.slice(0, 3).map((item, index) => ({
            id: item.tokenId,
            name: 'FWNFT',
            price: item.price,
            rarity: item.rarity,
            seller: item.seller,
            image: previewNFTs[index % previewNFTs.length].image
          }))
        )
      } catch (error) {
        console.error('Marketplace error:', error)
      }
    }

    loadListings()
  }, [])

  return (
    <section className={styles.marketplace}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <div>
            <span>Marketplace preview</span>
            <h2>NFTs we have</h2>
          </div>

          <Link to="/marketplace">Check all</Link>
        </div>

        <div className={styles.cards}>
          {(listings.length === 0 ? previewNFTs : listings).map((item) => (
            <NFTCard
              key={item.id}
              nft={item}
              actionLabel="Buy"
              disabled
            />
          ))}
        </div>
      </div>
    </section>
  )
}
