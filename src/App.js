import React, { useEffect, useState, useMemo, Fragment } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { userContext } from './Context/userContext';
import { urlContext } from './Context/urlContext';
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import toast, { Toaster } from 'react-hot-toast';

function App() {

  const [user, setUser] = useState(0);
  const [Auth, setAuth] = useState(false)
  const userMemo = useMemo(() => ({ user, setUser }), [user, setUser]);
  const [url, setUrl] = useState('https://proj-dsr-production.up.railway.app');
  const urlMemo = useMemo(() => ({ url, setUrl }), [url, setUrl]);

  const setAuthent = (Boolean) => {
    setAuth(Boolean);
  };


  useEffect(() => {
    isAuth()
    console.log(Auth);
  }, [])

  async function isAuth() {
    try {
      const response = await fetch(url + `/auth/is-verify`, {
        method: "GET",
        headers: { token: localStorage.token }
      })

      const parseRes = await response.json()
      console.log(parseRes);

      if (parseRes === true) {
        setAuth(true)
      }
      else {
        setAuth(false)
      }

    } catch (error) {
      console.error(error.message)
    }


  }
  return (
    <Fragment>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />
      <urlContext.Provider value={urlMemo}>
        <userContext.Provider value={userMemo}>
          <Router>
            <Routes>
              <Route path={"/dashboard"} element={!Auth ? <Navigate replace to="/login" /> : <Landing setAuthent={setAuthent} />} />
              <Route path="/" element={Auth ? <Landing setAuthent={setAuthent} /> : <Navigate replace to="/dashboard" />} />
              <Route path="/login" element={!Auth ? <Login setAuthent={setAuthent} /> : <Navigate replace to="/dashboard" />} />
              <Route path="/register" element={!Auth ? <Register setAuthent={setAuthent} /> : <Navigate replace to="/dashboard" />} />
            </Routes>
          </Router>
        </userContext.Provider>
      </urlContext.Provider>
    </Fragment>
  );
}

export default App;
