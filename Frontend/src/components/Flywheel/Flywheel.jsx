import styles from './Flywheel.module.css'

export const Flywheel=()=>{
 return <section className={styles.flywheel}><div className={styles.container}>
 <div className={styles.heading}><span>Our ecosystem offering</span><h2>One action powers the next</h2></div>
 <div className={styles.steps}>
  <article><span>01</span><h3>Mint</h3><p>Create</p></article>
  <article><span>02</span><h3>Fuse</h3><p>Combine</p></article>
  <article><span>03</span><h3>Stake</h3><p>Lock</p></article>
  <article><span>04</span><h3>Earn</h3><p>Receive</p></article>
  <article><span>05</span><h3>Trade</h3><p>Use</p></article>
 </div>
 </div></section>
}
