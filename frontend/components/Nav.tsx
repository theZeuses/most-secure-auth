import { isLoggedIn, removeExpiresIn, removeJwtToken, removeRefreshToken } from "../helpers/authHelper"
import { useEffect } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';

function Nav() {
  const [loggedIn, setLoggedIn] = useState(false);
  const route = useRouter(); 

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  function logOut(event: any){
    removeJwtToken();
    removeRefreshToken();
    removeExpiresIn();
    route.push('/')
  }
  return (
    <div>
        <nav className="relative w-full flex flex-wrap items-center justify-between py-3 bg-gray-900 text-gray-200 shadow-lg navbar navbar-expand-lg navbar-light" >
            <div className="container-fluid w-full flex flex-wrap items-center justify-between px-6">
                <div className="collapse navbar-collapse flex-grow items-center" id="navbarSupportedContent1">
                <span className="text-xl text-white pr-2 font-semibold">SAuth</span>
                { loggedIn ? <span onClick={e => logOut(e)} className="nav-link text-red">Log Out</span> : <a className="nav-link text-red" href="/">Log In</a> }
                </div>
            </div>
        </nav>
    </div>
  )
}

export default Nav