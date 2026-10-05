import {ROBINHOOD_TESTNET} from '../../config/network'
import logo from '../../assets/icons/logo.png'
import styles from './Footer.module.css'

export const Footer=()=>{
 return <footer className={styles.footer}>
  <div className={styles.container}>
   <img src={logo} alt="FLYChain"/>
   <p><i></i> Robinhood Testnet · Chain ID {ROBINHOOD_TESTNET.chainId}</p>
  </div>
 </footer>
}
