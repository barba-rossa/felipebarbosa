// App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [name] = useState('Felipe Barbosa');
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>{name}</h1>
      </header>
    </div>
  );
}

export default App;