import { PageHeader } from '@waypoint/ui';
import styles from './FeatureFlagsPage.module.css';

export function FeatureFlagsPage() {
  return (
    <div className={styles.page}>
      <PageHeader title="FeatureFlags" subtitle="Toggle organization feature flags" />
      <section className={styles.content}>
        <p>Operational controls for flags in the Waypoint admin console.</p>
      </section>
    </div>
  );
}

export default FeatureFlagsPage;
