import axios from 'axios'; 

const axiosAppJson = axios.create({
    baseURL: process.env.REACT_APP_DOMAIN_SERVER_API,
    timeout: 10000,
    withCredentials: true,
    headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json'
    }
});

const axiosFromData = axios.create({
    baseURL: process.env.REACT_APP_DOMAIN_SERVER_API,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-type': 'multipart/form-data',
        'Accept': 'application/json'
    }
});


export { axiosAppJson, axiosFromData };