import styles from './news_ticker.module.css';

export default function NewsTicker() {
  return (
    <div className={styles.ticker_container}>
      {/* 箭頭 */}
      <div className={styles.ticker_icon}>&rarr;</div>
      {/* 文字 */}
      <div className={styles.ticker}>Friday, February 16, 2024 +Apparel+Element+Edition+New Post</div>
    </div>
  )
}
