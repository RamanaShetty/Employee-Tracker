import axios from 'axios';


interface LoginResponse {
    id: string;
    name: string;
    role: string;
}

export const login = async (email: string, password: string, role: string): Promise<any> => { // Change to any to capture the whole response
    try {
        console.log(`email: ${email} password: ${password} role: ${role}`);
        const response = await axios.post<LoginResponse>('http://localhost:4200/api/login',{ email, password, role },{withCredentials: true});
        console.log("Response code: " + response.status);
        
        if (response.data.id) {
            localStorage.removeItem('loginStatus');
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        
        console.log("Logged user: ", response.data);
        return response; // Return the entire response object
    } catch (error: any) {
        localStorage.setItem('loginStatus', 'Login failed: ' + error.message);
        console.error('Login failed:', error.response?.data || error.message);
        throw error; // Rethrow to handle in your UI
    }
};

export const getUserFromStorage = (): LoginResponse | null => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) as LoginResponse : null;
};

export const logout = async (): Promise<any> => {
    try {
        const response = await axios.get('http://localhost:4200/api/logout', {withCredentials: true});
        if(response.status == 200){
            return true
        }else{
            return false
        }
    } catch (error: any) {
        console.error('Login failed:', error.message);
        return false
    }
};
