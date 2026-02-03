import "./App.css";
import { Navbar } from "./components/Navbar";
import { Outlet } from "react-router";
import { Footer } from "./components/Footer";

function App() {
  return (
    <>
      <main className="main-container">
        <div className="row">
          <div className="col">
            <Navbar />
            <Outlet />
            <Footer />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
