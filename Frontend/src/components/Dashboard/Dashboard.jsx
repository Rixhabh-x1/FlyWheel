import { useEffect, useState } from 'react'
import StatsCard from '../StatsCard'
import { useWallet } from '../../hooks/useWallet'
import { getTokenBalance, getOwnedNFTs, getStakingData } from '../../services/api'
import styles from './Dashboard.module.css'

export const Dashboard = () => {
  const wallet = useWallet()
  const [stats, setStats] = useState({
    balance: '0.00',
    owned: 0,
    staked: 0
  })

  useEffect(() => {
    if (!wallet.address) return

    const loadStats = async () => {
      try {
        const [token, nfts, staking] = await Promise.all([
          getTokenBalance(wallet.address),
          getOwnedNFTs(wallet.address),
          getStakingData(wallet.address)
        ])

        setStats({
          balance: token.balance,
          owned: nfts.count,
          staked: staking.count
        })
      } catch (error) {
        console.error('Dashboard error:', error)
      }
    }

    loadStats()
  }, [wallet.address])

  return (
    <section className={styles.dashboard}>
      <div className={styles.container}>

        <div className={styles.heading}>
          <div>
            <span>Your dashboard</span>
            <h2>Flywheel overview</h2>
          </div>

          {!wallet.isConnected &&
            <button onClick={wallet.connect}>
              Connect to load live stats →
            </button>
          }
        </div>

        <div className={styles.cards}>
          <StatsCard icon="F" label="FWT balance" value={stats.balance} detail="FWT" />
          <StatsCard icon="O" label="NFTs owned" value={stats.owned} detail="Owned NFTs" />
          <StatsCard icon="S" label="NFTs staked" value={stats.staked} detail="Currently staked" />
        </div>

      </div>
    </section>
  )
}