import "./App.css";
import ConfirmModalProvider from "./components/ConfirmModal";
import Main from "./pages/Main";

function App() {
  return (
    <ConfirmModalProvider>
      <Main />
    </ConfirmModalProvider>
  );
}

export default App;
