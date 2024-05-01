import React from 'react'
import GoogleButton from 'react-google-button'
// import Cookies from "js-cookie";
import axios from 'axios'
import { Col, Row } from 'antd'
import OAuthImage from '../assets/google_oauth.jpg'

export default function Login() {
    const handleLogin = async () => {
        try {
            const {data: { url },} = await axios.get(`http://localhost:5000/auth/url`, {withCredentials: true})
            console.log(url)
            window.location.assign(url)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className='user-profile'>
            <div className='login-card'>                
                <Row justify={'center'} align={'middle'} gutter={10}>
                    <Col md={16} style={{margin:'0px', display:'flex', alignItems:'center'}}>
                        <img src={OAuthImage} className='OAuthImage' alt='OAuthImage' />
                    </Col>
                    <Col md={8}>
                        <h2>Login</h2>
                        <GoogleButton
                            className='google-login-btn'
                            type="light" // can be light or dark
                            onClick={() => { handleLogin() }}                            
                        />
                    </Col>
                </Row>
            </div>
        </div>
    )
}
