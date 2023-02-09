import logo from './Quarrio_head_cirle.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Quarrio Test - Amazing!!
        </p>
        <a
          className="App-link"
          href="https://quarrio.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Quarrio.com
        </a>
      </header>
    </div>
  );
}

export default App;
