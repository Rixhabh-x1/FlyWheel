import styles from './GameNFTCard.module.css'

function GameNFTCard({nft,buttonText,onClick,disabled,selected,extra}){
 return <div className={`${styles.card} ${selected?styles.selected:''}`}>
  <img src={nft.image} alt={`Flywheel NFT ${nft.id}`}/>
  <div className={styles.info}>
   <span>Flywheel NFT</span>
   <h3>Token #{nft.id}</h3>
   <p>Rarity: <b>{nft.rarityName}</b></p>
   {extra&&<p>{extra}</p>}
   {buttonText&&<button className="button" type="button" onClick={()=>onClick(nft)} disabled={disabled}>{buttonText}</button>}
  </div>
 </div>
}

export default GameNFTCard
