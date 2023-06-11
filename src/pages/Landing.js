import React, { useContext, useEffect, useState, useRef, isValidElement } from "react";
import { Sidebar, Menu, MenuItem, sidebarClasses, menuClasses, ProSidebarProvider } from 'react-pro-sidebar';
import Dashboard from "../Components/Dashboard"
import { userContext } from '../Context/userContext';
import { urlContext } from '../Context/urlContext';

const Landing = ({ setAuthent }) => {
    const { user, setUser } = useContext(userContext);
    const { url } = useContext(urlContext);

    async function getUser() {
        const response = await fetch(url + `/dashboard`, {
            method: "GET",
            headers: { token: localStorage.token }
        })
        const parseRes = await response.json()
        console.log(parseRes);
        setUser(parseRes.user)
    }
    useEffect(() => {
        getUser()
    }, [])
    const logout = e => {
        e.preventDefault();
        localStorage.removeItem("token");
        setAuthent(false)
    }
    return (
        <div className="App">
            <ProSidebarProvider>
                <div style={{ display: 'flex', height: '100%' }}>

                    <Sidebar
                        rootStyles={{
                            [`.${sidebarClasses.container}`]: {

                                backgroundColor: '#0b2948',
                                color: '#8ba1b7',
                                hover: {
                                    backgroundColor: '#00458b',
                                    color: '#b6c8d9',
                                }

                            },
                        }}
                    >
                        <div className='sidenav-title'>
                            <h4>
                                Daily Time Record
                            </h4>
                        </div>
                        <Menu>

                            <MenuItem > Dashboard </MenuItem>
                            <MenuItem onClick={logout}> Logout </MenuItem>
                        </Menu>
                    </Sidebar>
                    <Dashboard />
                </div >

            </ProSidebarProvider>

        </div>
    )
}

export default Landing