import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Home, Protest, CreateProtest } from "./pages";
import "./App.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/create-protest">
          <CreateProtest />
        </Route>
        <Route path="/protest/:id">
          <Protest />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
