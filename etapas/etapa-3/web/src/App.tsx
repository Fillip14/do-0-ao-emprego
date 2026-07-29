import Header from './components/Header';
import Content from './components/Content';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <Content />
      <p> Quantas tarefas ainda tenho para fazer? {1 + 1} tarefas</p>
    </>
  );
}

export default App;
