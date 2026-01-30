import styles from "./StatItem.module.css";

function StatItem({ text, percentage }) {
  return (
    <div className={styles.statItem}>
      <p className={styles.statText}>{text}</p>
      <p className={styles.statNum}>{percentage}%</p>
    </div>
  );
}

export default StatItem;
