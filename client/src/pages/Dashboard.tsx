import Greeting from '../components/Greeting';
import WaitingList from '../components/WaitingList';
import NewGameButton from '../components/NewGameButton';
import UserLogoutButton from '../components/UserLogoutButton';
import styles from '@styles/Dashboard.module.css';

const Dashboard: React.FC = () => {
  return (
    <div className={styles.dashboard_container}>
      <Greeting />
      <WaitingList />
      <NewGameButton />
      <UserLogoutButton />
    </div>
  );
}

export default Dashboard;
