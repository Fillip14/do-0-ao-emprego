import { Header } from './components/Header';
import { TaskSection } from './components/tasks/TaskSection';
import { mockTasks } from './data/mockTasks';
import './App.css';
// import { emptyTask } from './data/mockTasks'; para testar com array vazio

function App() {
  return (
    <>
      <Header />
      <main>
        <TaskSection tasks={mockTasks} />
      </main>
      <footer></footer>
    </>
  );
}

export default App;
