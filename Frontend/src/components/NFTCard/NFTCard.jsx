import styles from './NFTCard.module.css'

function NFTCard(props){
 const nft=props.nft
 function clicked(){if(props.onAction)props.onAction(nft)}
 return <article className={styles.card}>
 <div className={styles.image}><img src={nft.image} alt={nft.name}/></div>
 <div className={styles.content}><p>Flywheel NFT <span>#{nft.id}</span></p><h3>{nft.name}</h3>
 <div className={styles.footer}><div><span>Price</span><strong>{nft.price} FWT</strong></div><button type="button" onClick={clicked} disabled={props.disabled}>{props.actionLabel||'View NFT'}</button></div>
 </div></article>
}
export default NFTCard
