import React , {useEffect} from 'react'
import axios from 'axios';
// import { response } from 'express';

function LoginPage(){
    
    
    useEffect(() =>{
        axios.get('/api/hello')
        .then(response=>console.log(response.data))
    }, [])

    return(
        <div>
            LoginPage
        </div>
    )
    
    
}

export default LoginPage