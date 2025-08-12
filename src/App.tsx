import { Counter } from "./components/counter";
import { Theme } from "./components/theme";

function App() {
  return (
    <div className="bg-background text-foreground flex h-screen w-full flex-col items-center justify-center gap-4">
      <h1 className="text-center text-2xl font-semibold">
        Vite-Rolldown + React
      </h1>
      <Counter />
      <Theme />
    </div>
  );
}

export default App;
