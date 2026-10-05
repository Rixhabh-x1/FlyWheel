export const CONTRACT_ADDRESSES = {
  token: '0xa11ee00eabc60ae4Dfc1f1e97A886818138bd519',
  nft: '0xF406A0Ceed3C05Bd17779a277E564b31Eeb070c3',
  staking: '0x4c9bfBAa9A39ea0f5ebf8ad5D796eFCA06Ee66D7',
  marketplace: '0xA2547D655dC4FFD3e1Cf9d749f07b4b7176c2FfD',
}

export const hasContractAddresses = Object.values(CONTRACT_ADDRESSES).every(Boolean)
