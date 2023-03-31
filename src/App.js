import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import React from "react";


const App = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route path="/home/*" element={<Home />} />
    </Routes>
  );
};

export default App;

/* import React from "react";

class Header extends React.Component {
  render() {
    return (

    );
  }
}

export default Header; */
