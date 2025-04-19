import React, { useState } from 'react';
import JoinRoom from './components/JoinRoom';
import PollRoom from './components/PollRoom';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  return (
    <div>
      {!user ? <JoinRoom setUser={setUser} /> : <PollRoom user={user} />}
    </div>
  );
}

export default App;
