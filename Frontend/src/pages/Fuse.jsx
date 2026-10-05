import {useEffect,useState} from 'react'
import {BrowserProvider,Contract} from 'ethers'
import GameNFTCard from '../components/GameNFTCard'
import TransactionBox from '../components/TransactionBox'
import {useWallet} from '../hooks/useWallet'
import {CONTRACT_ADDRESSES} from '../config/contracts'
import {ROBINHOOD_TESTNET} from '../config/network'
import nftABI from '../contracts/nftABI.json'
import {getNftImage,getRarityName} from '../data/nftDisplay'
import {getEthereumProvider,getExplorerTransactionUrl,getWalletError} from '../utils/blockchain'
import styles from './Fuse.module.css'

function Fuse(){
 const wallet=useWallet()
 const [nfts,setNfts]=useState([])
 const [nftA,setNftA]=useState(null)
 const [nftB,setNftB]=useState(null)
 const [loading,setLoading]=useState(false)
 const [error,setError]=useState('')
 const [status,setStatus]=useState('')
 const [message,setMessage]=useState('')
 const [hash,setHash]=useState('')
 const [reload,setReload]=useState(0)

 useEffect(()=>{
  const timer=setTimeout(async()=>{
   if(!wallet.address||!wallet.isCorrectNetwork||!CONTRACT_ADDRESSES.nft){setNfts([]);return}
   setLoading(true)
   setError('')
   try{
    const provider=new BrowserProvider(getEthereumProvider())
    const contract=new Contract(CONTRACT_ADDRESSES.nft,nftABI,provider)
    const total=Number(await contract.nextTokenId())
    const list=[]
    for(let id=0;id<total;id++){
     try{
      const owner=await contract.ownerOf(id)
      if(owner.toLowerCase()===wallet.address.toLowerCase()){
       const rarity=Number(await contract.rarity(id))
       list.push({id:id,level:rarity,rarityName:getRarityName(rarity),image:getNftImage(rarity)})
      }
     }catch{continue}
    }
    setNfts(list)
   }catch{setError('Could not load your NFTs.')}
   setLoading(false)
  },0)
  return()=>clearTimeout(timer)
 },[wallet.address,wallet.isCorrectNetwork,reload])

 function chooseNft(nft){
  if(nftA&&nftA.id===nft.id){setNftA(null);return}
  if(nftB&&nftB.id===nft.id){setNftB(null);return}
  if(!nftA)setNftA(nft)
  else if(!nftB)setNftB(nft)
 }

 function nftCanFuse(nft){
  if(nft.level>=3)return false
  return nfts.some((item)=>item.id!==nft.id&&item.level===nft.level)
 }

 let canFuse=false
 if(nftA&&nftB)canFuse=nftA.id!==nftB.id&&nftA.level===nftB.level&&nftA.level<3
 const busy=status==='waiting'||status==='submitted'||status==='pending'

 async function fuse(){
  if(!canFuse||busy)return
  setHash('')
  try{
   const provider=new BrowserProvider(getEthereumProvider())
   const signer=await provider.getSigner()
   const contract=new Contract(CONTRACT_ADDRESSES.nft,nftABI,signer)
   const ownerA=await contract.ownerOf(nftA.id)
   const ownerB=await contract.ownerOf(nftB.id)
   const rarityA=Number(await contract.rarity(nftA.id))
   const rarityB=Number(await contract.rarity(nftB.id))
   if(ownerA.toLowerCase()!==wallet.address.toLowerCase()||ownerB.toLowerCase()!==wallet.address.toLowerCase())throw new Error('You do not own both NFTs.')
   if(rarityA!==rarityB||rarityA>=3)throw new Error('These NFTs cannot be fused.')
   setStatus('waiting')
   setMessage('Confirm the transaction in MetaMask.')
   const tx=await contract.fuse(nftA.id,nftB.id)
   setHash(tx.hash)
   setStatus('submitted')
   setMessage('Transaction submitted.')
   const waitTimer=setTimeout(()=>{setStatus('pending');setMessage('Waiting for confirmation...')},500)
   await tx.wait()
   clearTimeout(waitTimer)
   setStatus('confirmed')
   setMessage('NFTs fused successfully.')
   setNftA(null)
   setNftB(null)
   setReload((number)=>number+1)
  }catch(problem){setStatus('failed');setMessage(getWalletError(problem))}
 }

 const explorer=getExplorerTransactionUrl(hash,ROBINHOOD_TESTNET.blockExplorerUrls[0])
 return <div className="container inner-page">
 <header className="page-header"><div><span>Fusion chamber</span><h1>Fuse NFTs</h1><p>Combine two NFTs with the same rarity.</p></div></header>
 {!wallet.isConnected&&<div className={styles.notice}><p>Connect your wallet first.</p><button className="button" onClick={wallet.connect}>Connect wallet</button></div>}
 {wallet.isConnected&&!wallet.isCorrectNetwork&&<div className={styles.notice}><p>Switch to Robinhood Testnet.</p><button className="button" onClick={wallet.switchNetwork}>Switch network</button></div>}
 {wallet.isConnected&&wallet.isCorrectNetwork&&<>
  <section className={styles.chamber}><div className={styles.slot}>{nftA?<GameNFTCard nft={nftA}/>:<div><b>NFT A</b><p>Choose the first NFT</p></div>}</div><div className={styles.plus}>+</div><div className={styles.slot}>{nftB?<GameNFTCard nft={nftB}/>:<div><b>NFT B</b><p>Choose the second NFT</p></div>}</div></section>
  <div className={styles.fuseAction}><span>↓</span><button className="button" onClick={fuse} disabled={!canFuse||busy}>{busy?'Please wait...':'FUSE'}</button><span>↓</span><div className={styles.result}><small>Result</small><b>{canFuse?getRarityName(nftA.level+1):'Higher-rarity NFT'}</b></div>{nftA&&nftB&&nftA.level!==nftB.level&&<p>Both NFTs must have the same rarity.</p>}</div>
  <TransactionBox status={status} message={message} link={explorer}/>
  <section className={styles.collection}><div className="section-heading"><div><span>Your wallet</span><h2>Choose your NFTs</h2></div><button className={styles.refresh} onClick={()=>setReload(reload+1)}>Refresh</button></div>
  {loading&&<div className="empty-state"><h3>Loading NFTs...</h3></div>}{error&&<div className="empty-state"><h3>{error}</h3></div>}{!loading&&!error&&nfts.length===0&&<div className="empty-state"><h3>No NFTs found</h3></div>}
  <div className={styles.grid}>{nfts.map((nft)=>{
   let text='Select NFT'
   if(!nftCanFuse(nft))text='Not eligible'
   if(nftA&&nftA.id===nft.id)text='Remove NFT A'
   if(nftB&&nftB.id===nft.id)text='Remove NFT B'
   return <GameNFTCard key={nft.id} nft={nft} buttonText={text} onClick={chooseNft} selected={(nftA&&nftA.id===nft.id)||(nftB&&nftB.id===nft.id)} disabled={!nftCanFuse(nft)||busy}/>
  })}</div></section>
 </>}
 </div>
}
export default Fuse
