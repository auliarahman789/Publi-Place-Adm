import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../src/pages/Home/HomePage";
import DefaultLayout from "./layout/DefaultLayout";
import LoginPage from "./pages/Home/Login";

const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <DefaultLayout usePageBackground={false}>
            <LoginPage />
          </DefaultLayout>
        }
      />
      <Route
        path="/admin"
        element={
          <DefaultLayout usePageBackground={false}>
            <HomePage />
          </DefaultLayout>
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
