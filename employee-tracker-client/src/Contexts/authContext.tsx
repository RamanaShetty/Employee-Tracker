import axios from "axios";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState, ReactNode } from "react"

interface User {
    id: string,
    name: string,
    role: string
}

interface AuthContext {
    authUser: User | null,
    setAuthUser: Dispatch<SetStateAction<User | null>>;
}


const AuthContext = createContext<AuthContext | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuth must be used in AuthContextProvider')
    }
    return context;
}

export const AuthContextProvider = ({children}:{children: ReactNode}) => {
    // const storedUser = localStorage.getItem("employee-details");
    const [authUser, setAuthUser] = useState<User | null>(null);

    useEffect(()=>{
        async function findAuthUser() {
            try{
                const response = await axios.get<User>("http://localhost:4200/api/verifyUser", {withCredentials: true});
                if(response.data){
                    setAuthUser({id: response.data.id, name: response.data.name, role: response.data.role })
                }
            }
            catch(error: any){
                console.log(error.message);
            }
        }

        findAuthUser()
    },[])

    return <AuthContext.Provider value={{ authUser, setAuthUser }} >{children}</AuthContext.Provider>
}