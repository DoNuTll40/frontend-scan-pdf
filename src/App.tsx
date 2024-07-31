
import LoadingPage from "./components/LoadingPage";
import AppHook from "./hooks/AppHook";
import AppRoute from "./routes/AppRoute";

function App() {

  const { loading } = AppHook()!;

  if(loading){
    return <LoadingPage />
  }

  return (
    <>
      <AppRoute />
    </>
  );
}

export default App;
