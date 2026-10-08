import { useEffect, useState } from 'react'
import { BrowserProvider, Contract, formatUnits } from 'ethers'
import GameNFTCard from '../components/GameNFTCard'
import TransactionBox from '../components/TransactionBox'
import { useWallet } from '../hooks/useWallet'
import { CONTRACT_ADDRESSES } from '../config/contracts'
import { ROBINHOOD_TESTNET } from '../config/network'
import nftABI from '../contracts/nftABI.json'
import stakingABI from '../contracts/stakingABI.json'
import tokenABI from '../contracts/tokenABI.json'
import { getNftImage, getRarityName } from '../data/nftDisplay'
import { getEthereumProvider, getExplorerTransactionUrl, getWalletError } from '../utils/blockchain'
import { getTokenBalance, getOwnedNFTs, getStakingData } from '../services/api'
import styles from './Staking.module.css'

function Staking() {
  const wallet = useWallet()
  const [available, setAvailable] = useState([])
  const [staked, setStaked] = useState([])
  const [balance, setBalance] = useState('0')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [workingId, setWorkingId] = useState(null)
  const [status, setStatus] = useState('')
  const [message, setMessage] = useState('')
  const [hash, setHash] = useState('')
  const [reload, setReload] = useState(0)
  const [now, setNow] = useState(Math.floor(Date.now() / 1000))

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!wallet.address || !wallet.isCorrectNetwork) {
      setAvailable([])
      setStaked([])
      return
    }

    const loadStakingData = async () => {
      setLoading(true)
      setError('')

      try {
        const [tokenData, nftData, stakingData] = await Promise.all([
          getTokenBalance(wallet.address),
          getOwnedNFTs(wallet.address),
          getStakingData(wallet.address)
        ])

        const availableList = nftData.nfts.map((nft) => ({
          id: Number(nft.tokenId),
          level: nft.rarity,
          rarityName: getRarityName(nft.rarity),
          image: getNftImage(nft.rarity)
        }))

        const stakedList = stakingData.stakedNFTs.map((nft) => ({
          id: Number(nft.tokenId),
          level: nft.rarity,
          rarityName: getRarityName(nft.rarity),
          image: getNftImage(nft.rarity),
          stakedAt: Number(nft.stakedAt)
        }))

        setBalance(tokenData.balance)
        setAvailable(availableList)
        setStaked(stakedList)
      } catch {
        setError('Could not load staking data.')
      }

      setLoading(false)
    }

    loadStakingData()
  }, [wallet.address, wallet.isCorrectNetwork, reload])

  function showNumber(number) { return Number(number).toFixed(4) }

  const REWARD_RATE_PER_SECOND = 0.001

  function showTime(seconds) {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (days > 0) return `${days}d ${hours}h ${minutes}m ${secs}s`
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`
    if (minutes > 0) return `${minutes}m ${secs}s`
    return `${secs}s`
  }

  function getLiveSeconds(nft) {
    return Math.max(0, now - nft.stakedAt)
  }

  function getLiveReward(nft) {
    return getLiveSeconds(nft) * REWARD_RATE_PER_SECOND
  }

  async function stakeNft(nft) {
    if (workingId !== null) return
    setWorkingId(nft.id)
    setHash('')
    try {
      const provider = new BrowserProvider(getEthereumProvider())
      const signer = await provider.getSigner()
      const nftContract = new Contract(CONTRACT_ADDRESSES.nft, nftABI, signer)
      const stakingContract = new Contract(CONTRACT_ADDRESSES.staking, stakingABI, signer)
      const owner = await nftContract.ownerOf(nft.id)
      if (owner.toLowerCase() !== wallet.address.toLowerCase()) throw new Error('You do not own this NFT.')
      const approved = await nftContract.getApproved(nft.id)
      const approvedForAll = await nftContract.isApprovedForAll(wallet.address, CONTRACT_ADDRESSES.staking)
      if (approved.toLowerCase() !== CONTRACT_ADDRESSES.staking.toLowerCase() && !approvedForAll) {
        setStatus('waiting')
        setMessage('Approve the staking contract in MetaMask.')
        const approveTx = await nftContract.approve(CONTRACT_ADDRESSES.staking, nft.id)
        setHash(approveTx.hash)
        setStatus('pending')
        setMessage('Waiting for approval...')
        await approveTx.wait()
      }
      setStatus('waiting')
      setMessage('Confirm Stake in MetaMask.')
      const tx = await stakingContract.stake(nft.id)
      setHash(tx.hash)
      setStatus('submitted')
      setMessage('Stake transaction submitted.')
      const waitTimer = setTimeout(() => { setStatus('pending'); setMessage('Waiting for confirmation...') }, 500)
      await tx.wait()
      clearTimeout(waitTimer)
      setStatus('confirmed')
      setMessage('NFT staked successfully.')
      setReload((number) => number + 1)
    } catch (problem) { setStatus('failed'); setMessage(getWalletError(problem)) }
    setWorkingId(null)
  }

  async function unstakeNft(nft) {
    if (workingId !== null) return
    setWorkingId(nft.id)
    setHash('')
    try {
      const provider = new BrowserProvider(getEthereumProvider())
      const signer = await provider.getSigner()
      const stakingContract = new Contract(CONTRACT_ADDRESSES.staking, stakingABI, signer)
      const stake = await stakingContract.stakes(nft.id)
      if (stake.owner.toLowerCase() !== wallet.address.toLowerCase()) throw new Error('This NFT is not staked by you.')
      setStatus('waiting')
      setMessage('Confirm Unstake in MetaMask.')
      const tx = await stakingContract.unstake(nft.id)
      setHash(tx.hash)
      setStatus('submitted')
      setMessage('Unstake transaction submitted.')
      const waitTimer = setTimeout(() => { setStatus('pending'); setMessage('Waiting for confirmation...') }, 500)
      await tx.wait()
      clearTimeout(waitTimer)
      setStatus('confirmed')
      setMessage('NFT unstaked and FWT reward paid.')
      setReload((number) => number + 1)
    } catch (problem) { setStatus('failed'); setMessage(getWalletError(problem)) }
    setWorkingId(null)
  }

  const explorer = getExplorerTransactionUrl(hash, ROBINHOOD_TESTNET.blockExplorerUrls[0])
  return <div className="container inner-page">
    <header className={`page-header ${styles.header}`}>
      <div><span>Rewards vault</span><h1>Staking</h1><p>Stake your NFTs and earn FWT.</p></div>
      <div className={styles.rateCard}>
        <h2>FWT rate (per staked NFT): </h2>
        <p>0.001 FWT/sec </p>
        <p> 0.06 FWT/min </p>
        <p> 3.6 FWT/hour </p>
        <p> 86.4 FWT/day </p>
      </div>
      <div className="page-header__badge">Your balance <strong>{showNumber(balance)} FWT</strong></div>
    </header>
    <div className={styles.rewardNote}><b>FWT rewards are paid when you unstake.</b><span>There is no Claim button.</span></div>
    {!wallet.isConnected && <div className={styles.notice}><p>Connect your wallet first.</p><button className="button" onClick={wallet.connect}>Connect wallet</button></div>}
    {wallet.isConnected && !wallet.isCorrectNetwork && <div className={styles.notice}><p>Switch to Robinhood Testnet.</p><button className="button" onClick={wallet.switchNetwork}>Switch network</button></div>}
    {wallet.isConnected && wallet.isCorrectNetwork && <>
      <TransactionBox status={status} message={message} link={explorer} />
      {loading && <div className="empty-state"><h3>Loading...</h3></div>}{error && <div className="empty-state"><h3>{error}</h3></div>}
      {!loading && !error && <>
        <section className={styles.section}><div className="section-heading"><div><span>Your wallet</span><h2>Available NFTs</h2></div><button className={styles.refresh} onClick={() => setReload(reload + 1)}>Refresh</button></div>
          {available.length === 0 && <div className="empty-state"><h3>No available NFTs</h3></div>}
          <div className={styles.grid}>{available.map((nft) => <GameNFTCard key={nft.id} nft={nft} buttonText={workingId === nft.id ? 'Please wait...' : 'Stake'} onClick={stakeNft} disabled={workingId !== null} />)}</div></section>
        <section className={styles.section}><div className="section-heading"><div><span>Rewards</span><h2>Staked NFTs</h2></div></div>
          {staked.length === 0 && <div className="empty-state"><h3>No staked NFTs</h3></div>}
          <div className={styles.grid}>{staked.map((nft) => <GameNFTCard key={nft.id} nft={nft} extra={'Staked for ' + showTime(getLiveSeconds(nft)) + ' · Est. ' + showNumber(getLiveReward(nft)) + ' FWT'} buttonText={workingId === nft.id ? 'Please wait...' : 'Unstake'} onClick={unstakeNft} disabled={workingId !== null} />)}</div></section>
      </>}
    </>}
  </div>
}
export default Staking
