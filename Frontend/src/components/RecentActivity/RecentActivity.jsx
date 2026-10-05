import { useEffect, useState } from 'react'
import { useWallet } from '../../hooks/useWallet'
import { getActivity } from '../../services/api'
import styles from './RecentActivity.module.css'

export const RecentActivity = () => {
  const wallet = useWallet()
  const [activity, setActivity] = useState([])

  useEffect(() => {
    if (!wallet.address) return

    const loadActivity = async () => {
      try {
        const data = await getActivity(wallet.address)
        setActivity(data.activity.slice(0, 5))
      } catch (error) {
        console.error('Activity error:', error)
      }
    }

    loadActivity()
  }, [wallet.address])

  if (!wallet.isConnected) return null

  return (
    <section className={styles.activity}>
      <div className={styles.container}>
        <h2 className={styles.title}>Recent Activity</h2>

        {activity.length === 0 ? (
          <p className={styles.empty}>No recent activity.</p>
        ) : (
          <div className={styles.list}>
            {activity.map((item) => (
              <div className={styles.item} key={`${item.transactionHash}-${item.tokenId}`}>
                <strong>{item.type}</strong>
                <span>NFT #{item.tokenId}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
