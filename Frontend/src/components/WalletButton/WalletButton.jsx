import {useWallet} from '../../hooks/useWallet'
import {shortenAddress} from '../../utils/blockchain'
import styles from './WalletButton.module.css'

function WalletButton(){
 const wallet=useWallet()
 return <button className={styles.button} type="button" onClick={wallet.connect} disabled={wallet.isConnecting}>
 {wallet.isConnecting?'Connecting...':wallet.address?shortenAddress(wallet.address):'Connect Wallet'}
 </button>
}
export default WalletButton
