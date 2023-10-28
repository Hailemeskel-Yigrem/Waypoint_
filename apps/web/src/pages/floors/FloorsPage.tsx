import { PageHeader } from '@waypoint/ui';
import styles from './FloorsPage.module.css';

export function FloorsPage() {
  return (
    <div className={styles.page}>
      <PageHeader title="Floors" subtitle="Organize floors within buildings" />
      <section className={styles.content}>
        <p>Operational controls for floors in the Waypoint admin console.</p>
      </section>
    </div>
  );
}

export default FloorsPage;
