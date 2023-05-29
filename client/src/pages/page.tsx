import { useContext } from "react";
import { UserContext } from "@context/UserContext";
import { GameContext } from "@context/GameContext";
import UsernameForm from "@components/UserForm";
import Game from "@components/Game";
import Dashboard from "@components/Dashboard";

export default function Page() {
  const userState = useContext(UserContext);
  const playingState = useContext(GameContext);

  if (playingState.value) {
    return <Game />;
  }

  if (userState.value !== null) { 
    return <Dashboard />
  }

  return <UsernameForm />;
}
