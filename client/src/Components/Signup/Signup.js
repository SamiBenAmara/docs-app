import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../functions';
import './Signup.css';

const formData = { firstname: "", lastname: "", username: "", email: "", password: "" };

const Signup = () => {

    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        formData.firstname = firstName;
        formData.lastname = lastName;
        formData.username = username;
        formData.email = email;
        formData.password = password;

        try {
            const signupSuccess = await signup(formData);
            if (signupSuccess === 'success') {
                localStorage.setItem("userEmail", email);
                navigate('/home');
            }

        } catch (err) {
            console.log(err.message);
        }
    };

    return (
        <div className="signupDiv">
            <h1 className='signupHeader'>Signup</h1>
            <form action="submit" onSubmit={handleSubmit}>
                <input className="signupInput" type="text" placeholder='First Name' onChange={(e) => setFirstName(e.target.value)} />
                <input className="signupInput" type="text" placeholder='Last Name' onChange={(e) => setLastName(e.target.value)}/>
                <input className="signupInput" type="text" placeholder='Username' onChange={(e) => setUserName(e.target.value)}/>
                <input className="signupInput" type="email" placeholder='Email Address' onChange={(e) => setEmail(e.target.value)}/>
                <input className="signupInput" type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)}/>
                <button 
                    className='signupButton'
                    type="submit"
                >
                    Signup
                </button>
            </form>
        </div>
    )
}

export default Signup