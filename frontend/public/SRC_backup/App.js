import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css'
import AdminLayout from "./component/admin/AdminLayout"
import PersistLogin from "./component/PersistLogin"
import Authorization from "./component/Authorization"
// import Signin from "./component/admin/Signin"
import Room from "./component/admin/Room"
import Dashboard from "./component/admin/Dashboard"
import Unauthorized from "./component/Unauthorized"
import PageNotFound from "./component/PageNoteFound"
import NetworkError from "./component/NetworkError"


import UserLayout from "./component/UserLayout"
import Home from "./component/Home"
import Booking from "./component/Booking"
import SigninU from "./component/Signin"
import SignupU from "./component/Signup"

import Test from "./component/Test"



function App() {
  useEffect(() => {
    console.log("This must run first for every page render or reload")

    return () => {
      console.log("Application end")
    }
  }, [])

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={ <UserLayout /> }>
            {/* Public Routes */}
            <Route path="/" Component={ Home } />
            <Route path="signin" Component={ SigninU } />
            <Route path="signup" Component={ SignupU } />
            
            {/* Protected User Routes */}
            <Route element={ <PersistLogin /> }>
              <Route element={ <Authorization allowedRoles={["manager", "receptionist", "guest"]} />} >
                <Route path="book" Component={ Booking } />
              </Route>
            </Route>
          </Route>


          {/* Protected Admin Routes */}
          <Route element={ <PersistLogin /> }>
            <Route element={ <Authorization allowedRoles={["manager", "receptionist"]} /> } >
              <Route path="admin" element={ <AdminLayout /> }>
                <Route path="dashboard" Component={ Dashboard } />
                <Route path="test" Component={ Test } />
                <Route path="room" Component={ Room } />
              </Route>
            </Route> 
          </Route>

          {/* For Errors */}
          <Route path="unauthorized" Component={ Unauthorized } />
          <Route path="network-error" Component={ NetworkError } />
          <Route path="*" Component={ PageNotFound } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
