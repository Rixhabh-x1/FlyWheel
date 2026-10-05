import styles from './TransactionBox.module.css'

function TransactionBox({status,message,link}){
 if(!status)return null
 let title=''
 if(status==='waiting')title='Waiting for MetaMask'
 if(status==='submitted')title='Submitted'
 if(status==='pending')title='Pending'
 if(status==='confirmed')title='Confirmed'
 if(status==='failed')title='Failed / Rejected'

 return <div className={`${styles.box} ${status==='failed'?styles.failed:''}`}>
  <strong>{title}</strong>
  <p>{message}</p>
  {link&&<a href={link} target="_blank" rel="noreferrer">View on explorer ↗</a>}
 </div>
}

export default TransactionBox
