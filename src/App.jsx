import Approutes from "./routes/Approutes";
import { Toaster } from "sonner";
import { useAuth } from "./hooks/useStore";
import { useEffect } from "react";
import { Spinner } from "./components";


function App() {
  const { checkAuth, user } = useAuth();

  useEffect(() => {
    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
if (user.isLoading) return <Spinner />;
  return (
    <>
      <Toaster richColors />
      <Approutes />
    </>
  );
}

export default App;
