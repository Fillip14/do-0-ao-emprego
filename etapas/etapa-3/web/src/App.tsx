import { Header } from './components/Header';
import { Content } from './components/Content';
import { mockTasks } from './data/mockTasks';
import './App.css';
// import { emptyTask } from './data/mockTasks'; para testar com array vazio

function App() {
  return (
    <>
      <Header />
      <main>
        <Content tasks={mockTasks} />
      </main>
    </>
  );
}

export default App;
