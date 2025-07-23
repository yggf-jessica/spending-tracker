// import React from "react";

// function App() {
//   return (
//     <div style={{ padding: 20 }}>
//       <h1>Hello! This is a test. ✅</h1>
//     </div>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Journal from "./components/Journal";

function App() {
  return (
    <Router>
      <div style={{ padding: 20 }}>
        <h1>Spending Tracker App 👄</h1>
        <nav>
          <Link to="/" style={{ marginRight: 10 }}>Dashboard</Link>
          <Link to="/journal">Journal</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/journal" element={<Journal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;