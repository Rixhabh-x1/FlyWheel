import {Link} from 'react-router-dom'
import nftimg from '../../assets/nfts/nftimg1.png'
import styles from './Hero.module.css'

export const Hero=()=>{
 return(
 <section className={styles.hero}>
 <div className={styles.container}>
  <div className={styles.copy}>
   <h1>Collect. Fuse.<br/>Stake. <em>Earn.</em></h1>
   <p>Enter an evolving NFT economy where every collectible can become stronger, generate rewards, and fuel your next move.</p>
   <div className={styles.buttons}><Link className={styles.mainButton} to="">Mint NFT</Link><Link className={styles.secondButton} to="">Explore marketplace</Link></div>
  </div>
  <div className={styles.art}><div className={styles.card}>
   <img src={nftimg} alt="FLYChain NFT"/>
   <div className={styles.info}><div><span>NFT</span><strong>FWNFT</strong></div><div><span>Rarity</span><strong>Legendary</strong></div></div>
  </div></div>
 </div>
 </section>)
}
