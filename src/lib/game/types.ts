export type PlayerColor = 'BLUE' | 'YELLOW' | 'RED' | 'GREEN' | 'LIGHTBLUE' | 'PINK' | 'ORANGE' | 'PURPLE';

export interface Coordinate {
  x: number;
  y: number;
}

export interface Piece {
  id: string;
  shape: number[][]; // 0 or 1 grid
  value: number; // Number of blocks (1-5)
}

export interface Player {
  id: string;
  color: PlayerColor;
  pieces: Piece[];
  isHuman: boolean;
  hasPassed: boolean;
  bonusScore: number;
}

export type BoardState = (PlayerColor | null)[][];

export interface GameState {
  board: BoardState;
  players: Player[];
  currentPlayerIndex: number;
  isGameOver: boolean;
  turnNumber: number;
  history: Move[];
}
export interface Move {
  player: PlayerColor;
  pieceId: string;
  position: Coordinate; // Top-left of the piece bounding box
  rotation: number; // 0, 90, 180, 270
  isFlipped: boolean;
  timestamp: number;
}

export interface LobbyPlayer {
  id: string;
  name: string;
  color: PlayerColor | null; // Null if not selected yet
  isReady: boolean;
  isHost: boolean;
}

export interface LobbyState {
  players: LobbyPlayer[];
}
