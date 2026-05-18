import { Outlet } from "react-router";

import { Navbar } from "./components/navbar/Navbar";
import { Footer } from "./components/footer/Footer";
import { ScrollToTop } from "./components/sroll-to-top/ScrollToTop";

import "./App.css";

function App() {
  return (
    <>
      <main className="main-container">
        <div className="row">
          <div className="col app-root">
            <Navbar />
            <ScrollToTop />
            <div className="app__content">
              <Outlet />
            </div>
            <Footer />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
