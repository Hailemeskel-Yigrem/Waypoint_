import { PageHeader } from '@waypoint/ui';
import styles from './TeamsPage.module.css';

export function TeamsPage() {
  return (
    <div className={styles.page}>
      <PageHeader title="Teams" subtitle="Organize people into teams" />
      <section className={styles.content}>
        <p>Operational controls for teams in the Waypoint admin console.</p>
      </section>
    </div>
  );
}

export default TeamsPage;
