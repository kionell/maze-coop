export interface GameConfig {
  /**
   * The number of rows of the maze.
   */
  rows: number;

  /**
   * The number of columns of the maze.
   */
  columns: number;

  /**
   * How many spawn points should be generated.
   */
  maxPlayers: number;

  /**
   * Max distance spread between each point.
   */
  maxSpread: number;
}