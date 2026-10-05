import styles from './StatsCard.module.css'

function StatsCard(props){
 return <article className={styles.card}>
 <div className={styles.icon}>{props.icon}</div>
 <div><span>{props.label}</span><strong>{props.value}</strong>{props.detail&&<small>{props.detail}</small>}</div>
 </article>
}
export default StatsCard
