import React, { useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

export default function JoinRoom({ setUser }) {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  const handleJoin = (isCreating = false) => {
    if (!name || !room) return;

    socket.emit(isCreating ? 'create_room' : 'join_room', { name, room }, (response) => {
      if (response.success) {
        localStorage.removeItem(room + '_vote'); // reset local vote on new join
        setUser({ name, room, socket, initialState: response.state });
      } else {
        alert(response.message);
      }
    });
  };

  return (
    <div className="card">
      <h2 className="title">Join or Create Poll Room</h2>
      <input placeholder="Your Name" onChange={(e) => setName(e.target.value)} />
      <input placeholder="Room Code" onChange={(e) => setRoom(e.target.value)} />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button onClick={() => handleJoin(true)} className="btn-create">Create</button>
        <button onClick={() => handleJoin(false)} className="btn-join">Join</button>
      </div>
    </div>
  );
}
