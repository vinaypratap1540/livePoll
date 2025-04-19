import React, { useEffect, useState } from 'react';

export default function PollRoom({ user }) {
  const [votes, setVotes] = useState(user.initialState.votes || { cats: 0, dogs: 0 });
  const [timeLeft, setTimeLeft] = useState(user.initialState.timer || 60);
  const [voted, setVoted] = useState(localStorage.getItem(user.room + '_vote'));

  useEffect(() => {
    const socket = user.socket;

    socket.on('vote_update', (updatedVotes) => {
      setVotes(updatedVotes);
    });

    socket.on('timer_update', (newTime) => {
      setTimeLeft(newTime);
    });

    return () => socket.disconnect();
  }, [user]);

  const vote = (option) => {
    if (voted || timeLeft <= 0) return;
    user.socket.emit('vote', { room: user.room, option });
    localStorage.setItem(user.room + '_vote', option);
    setVoted(option);
  };

  return (
    <div className="card">
      <h2 className="title">Poll: Cats vs Dogs</h2>
      <p className="timer">Time Left: {timeLeft}s</p>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button disabled={!!voted || timeLeft <= 0} onClick={() => vote('cats')} className="btn-option btn-cats">
          Cats ({votes.cats})
        </button>
        <button disabled={!!voted || timeLeft <= 0} onClick={() => vote('dogs')} className="btn-option btn-dogs">
          Dogs ({votes.dogs})
        </button>
      </div>
      {voted && <p className="status-message">You voted for {voted}</p>}
    </div>
  );
}

