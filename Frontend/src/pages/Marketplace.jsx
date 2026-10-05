import {useEffect,useState} from 'react'
import {BrowserProvider,Contract,parseUnits} from 'ethers'
import NFTCard from '../components/NFTCard'
import {useWallet} from '../hooks/useWallet'
import {CONTRACT_ADDRESSES} from '../config/contracts'
import {getMarketplaceListings,getOwnedNFTs} from '../services/api'
import marketplaceABI from '../contracts/marketplaceABI.json'
import nftABI from '../contracts/nftABI.json'
import tokenABI from '../contracts/tokenABI.json'
import {getEthereumProvider,getWalletError} from '../utils/blockchain'
import {getNftImage,getRarityName} from '../data/nftDisplay'
import {previewNFTs} from '../data/previewNFTs'

function Marketplace(){
 const wallet=useWallet()
 const [owned,setOwned]=useState([])
 const [listings,setListings]=useState([])
 const [working,setWorking]=useState(false)
 const [reload,setReload]=useState(0)

 useEffect(()=>{
  async function load(){
   try{
    const market=await getMarketplaceListings()

    setListings(market.listings.map(x=>({
     id:x.tokenId,
     name:'FWNFT',
     rarity:getRarityName(Number(x.rarity)),
     image:getNftImage(Number(x.rarity)),
     price:x.price,
     seller:x.seller
    })))

    if(wallet.address){
     const data=await getOwnedNFTs(wallet.address)
     setOwned(data.nfts.map(x=>({
      id:x.tokenId,
      rarity:getRarityName(Number(x.rarity)),
      image:getNftImage(Number(x.rarity))
     })))
    }
   }catch(e){console.error(e)}
  }
  load()
 },[wallet.address,reload])

 async function contracts(){
  const provider=new BrowserProvider(getEthereumProvider())
  const signer=await provider.getSigner()

  return {
   nft:new Contract(CONTRACT_ADDRESSES.nft,nftABI,signer),
   token:new Contract(CONTRACT_ADDRESSES.token,tokenABI,signer),
   market:new Contract(CONTRACT_ADDRESSES.marketplace,marketplaceABI,signer)
  }
 }

 async function listNFT(nft){
  const price=prompt('Price in FWT')
  if(!price)return

  try{
   setWorking(true)
   const {nft:nftContract,token,market}=await contracts()

   await (await nftContract.approve(CONTRACT_ADDRESSES.marketplace,nft.id)).wait()

   const decimals=Number(await token.decimals())

   await (await market.listNFT(
    nft.id,
    parseUnits(price,decimals)
   )).wait()

   alert('NFT listed successfully')
   setReload(x=>x+1)
  }catch(e){alert(getWalletError(e))}
  setWorking(false)
 }

 async function buyNFT(nft){
  try{
   setWorking(true)
   const {token,market}=await contracts()
   const decimals=Number(await token.decimals())
   const price=parseUnits(nft.price,decimals)

   await (await token.approve(
    CONTRACT_ADDRESSES.marketplace,
    price
   )).wait()

   await (await market.buyNFT(nft.id)).wait()

   alert('NFT bought successfully')
   setReload(x=>x+1)
  }catch(e){alert(getWalletError(e))}
  setWorking(false)
 }

 async function cancelNFT(nft){
  try{
   setWorking(true)
   const {market}=await contracts()

   await (await market.cancel(nft.id)).wait()

   alert('Listing cancelled')
   setReload(x=>x+1)
  }catch(e){alert(getWalletError(e))}
  setWorking(false)
 }

 return <div className="container inner-page">

  <header className="page-header">
   <div>
    <span>FWT economy</span>
    <h1>Marketplace</h1>
    <p>Buy and sell Flywheel NFTs using FWT.</p>
   </div>
  </header>

  {!wallet.isConnected&&
   <button className="button" onClick={wallet.connect}>Connect wallet</button>
  }

  {wallet.isConnected&&<>
   <section className="collection-section">
    <div className="section-heading">
     <div><span>Your wallet</span><h2>List an NFT</h2></div>
    </div>

    <div className="nft-grid">
     {owned.map(nft=>
      <article className="nft-card" key={nft.id}>
       <img src={nft.image}/>
       <h3>Flywheel NFT #{nft.id}</h3>
       <p>{nft.rarity}</p>
       <button
        className="button"
        disabled={working}
        onClick={()=>listNFT(nft)}
       >
        List NFT
       </button>
      </article>
     )}
    </div>
   </section>
  </>}

  <div className="section-heading">
   <div><span>Marketplace</span><h2>Active listings</h2></div>
  </div>

  <div className="marketplace-cards">
   {listings.map(nft=>{
    const mine=wallet.address &&
     nft.seller.toLowerCase()===wallet.address.toLowerCase()

    return <NFTCard
     key={'listing-'+nft.id}
     nft={nft}
     disabled={working}
     actionLabel={!wallet.isConnected?'Connect':mine?'Cancel':'Buy'}
     onAction={()=>
      !wallet.isConnected
       ? wallet.connect()
       : mine
         ? cancelNFT(nft)
         : buyNFT(nft)
     }
    />
   })}

   {previewNFTs.map(nft=><NFTCard
    key={'preview-'+nft.id}
    nft={nft}
    actionLabel="Buy"
   />)}
  </div>

 </div>
}

export default Marketplace
