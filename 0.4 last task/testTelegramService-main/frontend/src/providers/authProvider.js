import jwtDecode from "jwt-decode";
import {host} from "./host";


const authProvider = {
    login: ({username, password}) => {
        const request = new Request(
            host + '/users',
            {
                method: "POST",
                body: JSON.stringify({username, password}),
                headers: new Headers({'Content-Type': 'application/json'})
            })
        return fetch(request)
            .then(resp => {
                if (resp.status < 200 || resp.status >= 300) {
                    throw new Error(resp.statusText)
                }
                return resp.json();
            })
            .then(data => {
                const decodedToken = jwtDecode(data.token)
                localStorage.setItem('role', decodedToken.sub.role)
                localStorage.setItem('token', data.token)
            })
    },
    logout: () => {
        localStorage.removeItem('role')
        localStorage.removeItem('token')
        return Promise.resolve()
    },
    getPermissions: () => {
        const role = localStorage.getItem('role')
        return role? Promise.resolve(role) : Promise.reject();
    },
    checkAuth: () => {
        return localStorage.getItem('token')
            ? Promise.resolve()
            : Promise.reject(
            {redirectTo: '/account/login'}
            )
    },
    checkError: (error) => {
        return Promise.reject()
    }
}

export default authProvider;