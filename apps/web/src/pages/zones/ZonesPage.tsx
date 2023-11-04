import { PageHeader } from '@waypoint/ui';
import styles from './ZonesPage.module.css';

export function ZonesPage() {
  return (
    <div className={styles.page}>
      <PageHeader title="Zones" subtitle="Partition floors into bookable zones" />
      <section className={styles.content}>
        <p>Operational controls for zones in the Waypoint admin console.</p>
      </section>
    </div>
  );
}

export default ZonesPage;
