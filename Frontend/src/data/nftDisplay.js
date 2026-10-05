import nftimg1 from '../assets/nfts/nftimg1.png'
import nftimg2 from '../assets/nfts/nftimg2.jpg'
import nftimg3 from '../assets/nfts/nftimg3.jpg'

export function getRarityName(number) {
  if (number === 1) return 'Common'
  if (number === 2) return 'Rare'
  if (number === 3) return 'Epic'
  return 'Unknown'
}

export function getNftImage(number){
 if(number===2)return nftimg2
 if(number===3)return nftimg3
 return nftimg1
}
