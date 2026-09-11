import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar from "./components/Navbar";

import Home from "./pages/home";
import Test from "./pages/Test";
import Stagger from "./pages/Stagger";
import Stagger2 from "./pages/Stagger2";
import Home2 from "./pages/Home2";

import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <main className="relative min-h-screen w-screen overflow-x-hidden">

        <div
          id="main-navbar"
          className="relative z-[100]"
        >
          <NavBar />
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Test />} />
          <Route path="/stagger" element={<Stagger />} />
          <Route path="/stagger2" element={<Stagger2 />} />
          <Route path="/home2" element={<Home2 />} />
        </Routes>

        {/* <Footer /> */}
      </main>
    </BrowserRouter>
  );
}

export default App;