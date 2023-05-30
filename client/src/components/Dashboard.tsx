import Greeting from './Greeting';
import WaitingList from './WaitingList';
import NewGameButton from './NewGameButton';
import UserLogoutButton from './UserLogoutButton';
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
