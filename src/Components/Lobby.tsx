import React, { useState, useEffect } from 'react';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

interface Room {
  id: string;
  name: string;
}

const Lobby: React.FC = () => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomName, setRoomName] = useState('');

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5000/GameHub')
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, []);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          console.log('Connected to the hub');
          connection.on('RoomCreated', (room: Room) => {
            setRooms(prevRooms => [...prevRooms, room]);
            rooms.forEach(room => console.log(room.id))
          });
          connection.on('RoomsLoaded', (loadedRooms: Room[]) => {
            setRooms(loadedRooms);
          });
          // connection.on('JoinedToRoom', (joinedRoom: Room) => {

          // })

          // Pobieranie istniejących pokoi
          connection.invoke<Room[]>('GetRooms').catch(err => console.error(err));
        })
        .catch(e => console.log('Connection failed: ', e));

      // Cleanup on unmount
      return () => {
        connection.stop();
      };
    }
  }, [connection]);

  const handleCreateRoom = () => {
    if (connection && roomName) {
      connection.invoke('CreateRoom', roomName)
        .catch(err => console.error(err));
    }
  };

  const handleJoinRoom = (roomId: string) => {
    if (connection) {
      connection.invoke('JoinRoom', roomId)
        .catch(err => console.error(err));
    }
  };

  const handleRoomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={roomName}
        onChange={handleRoomNameChange}
        placeholder="Nazwa pokoju"
      />
      <button onClick={handleCreateRoom}>Utwórz pokój</button>
      <div>
        <h3>Dostępne pokoje:</h3>
        <ul>
        {
          rooms.map(room => (
            <li key={room.id}>
              {room.name}
              <button onClick={() => handleJoinRoom(room.id)}>Join</button>
            </li>
          ))
        }
        </ul>
      </div>
    </div>
  );
};

export default Lobby;