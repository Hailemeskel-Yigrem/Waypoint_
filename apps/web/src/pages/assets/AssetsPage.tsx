import { PageHeader } from '@waypoint/ui';
import styles from './AssetsPage.module.css';

export function AssetsPage() {
  return (
    <div className={styles.page}>
      <PageHeader title="Assets" subtitle="Track workplace assets" />
      <section className={styles.content}>
        <p>Operational controls for assets in the Waypoint admin console.</p>
      </section>
    </div>
  );
}

export default AssetsPage;
