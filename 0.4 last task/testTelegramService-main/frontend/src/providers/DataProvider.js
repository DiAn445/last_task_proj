import Provider from 'ra-data-json-server'
import {fetchUtils} from "react-admin";


const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({Accept: 'application/json'})
    }
    options.headers.set(
        'Authorization',
        `Bearer ${localStorage.getItem('token')}`
    )
    return fetchUtils.fetchJson(url, options)
}


const defaultProvider = Provider('http://127.0.0.1:5000', httpClient)


export const DataProvider = {
    ...defaultProvider,
    getList: (resource, params) => {
        params.filter = params.meta ? params.meta : {}
        return defaultProvider.getList(resource, params)
    }
}
