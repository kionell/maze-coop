import { FormEvent } from 'react';
import { useContext, useEffect, useState } from "react";
import { GameContext } from "@context/GameContext";
import { gameService } from "@services/GameService";
import Maze from "./Maze";
import styles from '@styles/Game.module.css';
// import { useLeavePageConfirm } from "@hooks/useLeavePageConfirm";

export default function Game() {
  const playingState = useContext(GameContext)

  const [players, setPlayers] = useState(2);
  const [rows, setRows] = useState(10);
  const [columns, setColumns] = useState(10);

  // useLeavePageConfirm();

  const onPlayersInput = (event: FormEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value);

    if (!value || value < 1) return;

    setPlayers(value);
  };

  const onRowsInput = (event: FormEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value);

    if (!value || value < 1) return;

    setRows(value);
  };

  const onColumnsInput = (event: FormEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value);

    if (!value || value < 1) return;

    setColumns(value);
  };

  useEffect(() => {
    gameService.onCancel(() => {
      playingState.set(false);
      gameService.leave();
    });

    return () => {
      gameService.offCancel();
    }
  }, [playingState]);

  return (
    <div className={styles['game-page']}>
      <Maze 
        players={players} 
        rows={rows} 
        columns={columns} 
      />

      <label htmlFor='players_input' title=''>Players</label>
      <input type="number" id="players_input" onBlur={onPlayersInput} />

      <label htmlFor='rows_input' title=''>Rows</label>
      <input type="number" id="rows_input" onBlur={onRowsInput} />

      <label htmlFor='columns_input' title=''>Columns</label>
      <input type="number" id="columns_input" onBlur={onColumnsInput} />
    </div>
  );
}
