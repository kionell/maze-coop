import { GameProvider } from './context/GameContext'
import { UserProvider } from './context/UserContext'
import Page from './pages/page'
import './App.css';

function App() {
  return (
    <div>
      <GameProvider>
        <UserProvider>
          <Page />
        </UserProvider>
      </GameProvider>
    </div>
  )
}

export default App
