import { Header } from './components/Header';
import { TaskSection } from './components/tasks/TaskSection';
import { mockTasks } from './data/mockTasks';
// import { emptyTask } from './data/mockTasks'; para testar com array vazio

function App() {
  return (
    <>
      <Header />
      <main className="flex w-screen justify-evenly">
        <TaskSection tasks={mockTasks} />
      </main>
      <footer></footer>
    </>
  );
}

export default App;
