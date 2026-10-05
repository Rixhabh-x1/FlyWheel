import { useCallback, useEffect, useMemo, useState } from 'react'
import { BrowserProvider } from 'ethers'
import { ROBINHOOD_TESTNET } from '../config/network'
import { getEthereumProvider } from '../utils/blockchain'
import { WalletContext } from './wallet-context'

export function WalletProvider({ children }) {
  const [address, setAddress] = useState('')
  const [chainId, setChainId] = useState(null)
  const [error, setError] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)

  const syncWallet = useCallback(async (accounts) => {
    const ethereum = getEthereumProvider()
    if (!ethereum || accounts.length === 0) {
      setAddress('')
      setChainId(null)
      return
    }

    const provider = new BrowserProvider(ethereum)
    const network = await provider.getNetwork()
    setAddress(accounts[0])
    setChainId(Number(network.chainId))
    setError('')
  }, [])

  useEffect(() => {
    const ethereum = getEthereumProvider()
    if (!ethereum) return undefined

    const handleAccountsChanged = (accounts) => {
      syncWallet(accounts).catch(() => setError('Could not refresh your wallet account.'))
    }
    const handleChainChanged = () => {
      ethereum.request({ method: 'eth_accounts' }).then(syncWallet).catch(() => {
        setError('Could not refresh the selected network.')
      })
    }

    ethereum.request({ method: 'eth_accounts' }).then(syncWallet).catch(() => {})
    ethereum.on('accountsChanged', handleAccountsChanged)
    ethereum.on('chainChanged', handleChainChanged)

    return () => {
      ethereum.removeListener('accountsChanged', handleAccountsChanged)
      ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }, [syncWallet])

  const connect = useCallback(async () => {
    const ethereum = getEthereumProvider()
    setError('')

    if (!ethereum) {
      setError('MetaMask was not detected. Install MetaMask to continue.')
      return
    }

    try {
      setIsConnecting(true)
      const provider = new BrowserProvider(ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])
      await syncWallet(accounts)
    } catch (walletError) {
      setError(walletError.code === 4001 ? 'Wallet connection was rejected.' : 'Unable to connect to MetaMask.')
    } finally {
      setIsConnecting(false)
    }
  }, [syncWallet])

  const switchNetwork = useCallback(async () => {
    const ethereum = getEthereumProvider()
    setError('')

    if (!ethereum) {
      setError('MetaMask was not detected. Install MetaMask to continue.')
      return
    }

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ROBINHOOD_TESTNET.chainIdHex }],
      })
    } catch (switchError) {
      if (switchError.code !== 4902) {
        setError(switchError.code === 4001 ? 'Network switch was rejected.' : 'Unable to switch networks.')
        return
      }

      try {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: ROBINHOOD_TESTNET.chainIdHex,
            chainName: ROBINHOOD_TESTNET.chainName,
            rpcUrls: ROBINHOOD_TESTNET.rpcUrls,
            nativeCurrency: ROBINHOOD_TESTNET.nativeCurrency,
            blockExplorerUrls: ROBINHOOD_TESTNET.blockExplorerUrls,
          }],
        })
      } catch (addError) {
        setError(addError.code === 4001 ? 'Adding the network was rejected.' : 'Unable to add Robinhood Testnet.')
      }
    }
  }, [])

  const value = useMemo(() => ({
    address,
    chainId,
    error,
    isConnecting,
    isConnected: Boolean(address),
    isCorrectNetwork: chainId === ROBINHOOD_TESTNET.chainId,
    connect,
    switchNetwork,
  }), [address, chainId, error, isConnecting, connect, switchNetwork])

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}
