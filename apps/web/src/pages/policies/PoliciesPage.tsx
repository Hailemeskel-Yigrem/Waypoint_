import { PageHeader } from '@waypoint/ui';
import styles from './PoliciesPage.module.css';

export function PoliciesPage() {
  return (
    <div className={styles.page}>
      <PageHeader title="Policies" subtitle="Configure access policies" />
      <section className={styles.content}>
        <p>Operational controls for policies in the Waypoint admin console.</p>
      </section>
    </div>
  );
}

export default PoliciesPage;
