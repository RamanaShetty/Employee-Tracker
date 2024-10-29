import axios from 'axios';

interface LoginResponse {
    token: string;
    id: string;
    role: string;
}

export const login = async (email: string, password: string, role: string): Promise<any> => { // Change to any to capture the whole response
    try {
        console.log(`email: ${email} password: ${password} role: ${role}`);
        const response = await axios.post<LoginResponse>('http://localhost:4200/login', { email, password, role });
        console.log("Response code: " + response.status);
        
        if (response.data.token) {
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

export const logout = (): void => {
    localStorage.removeItem('user');
};
