import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import { useToastyContext } from '../../../context/ToastyContext';
import Cookies from 'universal-cookie';
import { useOutsideClick } from '../../../hooks';
import { AiOutlineLoading } from 'react-icons/ai';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const cookies = new Cookies();

    const notify = useToastyContext();

    const forgotPassword = async event => {
        let passPrompt = prompt("Enter your registered email below to recieve a password reset email.");

        event.preventDefault();

        fetch('https://only-hands.herokuapp.com/api/user/forgot-password', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: passPrompt
            })
        })
        .then((res) => { 
            return res.json() 
        })
        .then((data) => {
            if (data["success"]) {
                console.log("message");
            }
            else
                console.log(data.message);
        })
        .catch(error => console.log(error))
    }

    const doLogin = async event =>  {

        event.preventDefault();

        if (username.length == 0 || password.length < 8) {
            setError(true);
        }

        fetch('https://only-hands.herokuapp.com/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then((res) => { 
            return res.json() 
        })
        .then((data) => {
            if (data["success"]) {
                cookies.set("token", data.token, { expires : new Date(Date.now() + 3600 * 1000)})
                console.log("Successfully logged in!")
                navigate('/profile');
                notify("Successfully logged in!", "success");
            }
            else
                console.log(data.message);
                notify(data.message, "error");
            })
        .catch(error => {
            console.log(error);
            notify(error.message, "error");
        })
    }

    return (
        <div>
            <h1 className="font-semibold text-center text-xl p-2">
                Welcome Back!
            </h1>
            <form onSubmit={doLogin}>
                <div className="flex flex-col">
                    <label htmlFor="username">Username
                        <br />
                        <input
                            id="username"
                            className="border border-gray-700 p-2 rounded mb-3"
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            placeholder="Username"
                        />
                        {error&&username.length<=0? 
                        <p className="text-s text-red-600 mb-2" datatype='username-error'>Please enter a valid username.</p>:""}
                    </label>
                    <label htmlFor="password">Password
                        <br />
                        <input
                            id="password"
                            className="border border-gray-700 p-2 rounded mb-3"
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="********"
                        />
                        {error&&password.length<8?
                        <p className="text-s text-red-600 mb-2">Please enter a valid password.</p>:""}
                    </label>
                    <button onClick={forgotPassword} className="mr-16 mb-1">Forgot password?</button>
                </div>
                <div className="text-center">
                    <button type="submit" className="px-5 py-2 m-2 bg-gray-700 text-white rounded grow-transition" data-testid='login-btn'>
                        Sign in
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Login;