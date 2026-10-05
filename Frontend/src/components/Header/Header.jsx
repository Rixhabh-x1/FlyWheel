import {NavLink} from 'react-router-dom'
import WalletButton from '../WalletButton'
import logo from '../../assets/icons/logo.png'
import styles from './Header.module.css'

export const Header=()=>{
 return(
 <header className={styles.header}>
  <div className={styles.container}>
<NavLink className={styles.logo} to="/">
 <img src={logo} alt="FLYChain"/>
 <span className={styles.logoText}>FLYCHAIN</span>
</NavLink>   <nav>
    <NavLink to="/" end className={({isActive})=>isActive?styles.active:''}>Home</NavLink>
    <NavLink to="/my-nfts" className={({isActive})=>isActive?styles.active:''}>My NFTs</NavLink>
    <NavLink to="/fuse" className={({isActive})=>isActive?styles.active:''}>Fuse</NavLink>
    <NavLink to="/staking" className={({isActive})=>isActive?styles.active:''}>Staking</NavLink>
    <NavLink to="/marketplace" className={({isActive})=>isActive?styles.active:''}>Marketplace</NavLink>
   </nav>
   <WalletButton/>
  </div>
 </header>)
}
