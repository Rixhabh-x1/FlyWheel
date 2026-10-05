export function shortenAddress(address, start = 6, end = 4) {
  if (!address) return ''
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

export function getExplorerTransactionUrl(hash, explorerUrl) {
  return hash ? `${explorerUrl}/tx/${hash}` : ''
}

export function getEthereumProvider() {
  return typeof window !== 'undefined' ? window.ethereum : undefined
}

export function getWalletError(error) {
  if (error?.code === 4001 || error?.code === 'ACTION_REJECTED') return 'Transaction rejected in MetaMask.'
  return error?.shortMessage || error?.reason || error?.message || 'Transaction failed.'
}
