import React, { useState } from 'react';

interface Player {
  id: string;
  name: string;
}

interface RoomProps {
  roomId: string;
  onJoin: (roomId: string, player: Player) => void;
}

const Room: React.FC<RoomProps> = ({ roomId, onJoin }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [board, setBoard] = useState<string[][]>(Array(19).fill(Array(19).fill(null))); // Plansza 19x19
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  // Przykładowa funkcja do dołączania gracza do pokoju
  const joinRoom = (playerName: string) => {
    if (players.length < 2) {
      const player: Player = {
        id: `player-${players.length + 1}`,
        name: playerName
      };
      setPlayers([...players, player]);
      onJoin(roomId, player); // Wywołanie funkcji dołączania (na przykład, powiadomienie backendu)
    } else {
      alert('Pokój jest pełny!');
    }
  };

  // Przykładowa funkcja do obsługi ruchu gracza (kliknięcia na planszy)
  const handleBoardClick = (x: number, y: number) => {
    if (!currentPlayer) {
      alert('Najpierw dołącz do gry.');
      return;
    }

    // Prosty przykład, który pozwala na postawienie kamienia tylko jeśli pole jest puste
    if (board[x][y] === null) {
      const newBoard = board.map(row => [...row]);
      newBoard[x][y] = currentPlayer.id; // Ustawienie ID gracza w wybranym miejscu
      setBoard(newBoard);

      // Zmiana aktywnego gracza
      setCurrentPlayer(players.find(player => player.id !== currentPlayer.id) || null);
    }
  };

  return (
    <div>
      <h2>Pokój gry: {roomId}</h2>
      <div>
        {players.map(player => (
          <div key={player.id}>{player.name}</div>
        ))}
      </div>
      <div>
        {players.length < 2 && (
          <button onClick={() => joinRoom('PlayerName')}>Dołącz jako gracz</button>
        )}
      </div>
      <div>
        <h3>Plansza do gry</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(19, 1fr)' }}>
          {board.map((row, x) =>
            row.map((cell, y) => (
              <div
                key={`${x}-${y}`}
                style={{
                  width: '30px',
                  height: '30px',
                  backgroundColor: cell ? (cell === players[0].id ? 'black' : 'white') : undefined,
                  border: '1px solid black'
                }}
                onClick={() => handleBoardClick(x, y)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Room;
