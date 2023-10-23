/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useState,useEffect } from "react";

export const UserContext = createContext(null);

export const UserContextProvider = ({children}) =>{
    const [user, setUser] = useState(null);
    const [ready,setReady] = useState(false)
    useEffect(()=>{
        const fetchData = async()=>{
            const {data} = await axios.post("/profile")
            // console.log(data)
            setUser(data)
            if(data != null){
                setReady(true)
            }
        }
        if(user === null){
            fetchData()
        }
    },[user])
    return (
        <UserContext.Provider value={{user,setUser,ready,setReady}}>
          {children}
        </UserContext.Provider>
    );
}