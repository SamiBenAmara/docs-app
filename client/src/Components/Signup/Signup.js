import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateFirstName, updateLastName, updateUserName, updateEmail, updateAllData } from '../../reduxSlices/userSlice';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../functions';
import './Signup.css';

// const formData = { firstname: "", lastname: "", username: "", email: "", password: "" };

const Signup = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayError, setDisplayError] = useState({ show: false, message: '' });

    const handleSubmit = async (e) => {

        // formData.firstname = firstName;
        // formData.lastname = lastName;
        // formData.username = userName;
        // formData.email = email;
        // formData.password = password;

        e.preventDefault();

        try {

            const formData = {
                firstName: firstName,
                lastName: lastName,
                userName: userName,
                email: email,
                password: password
            };

            const signupResult = await signup(formData);
            
            if (signupResult.status === 201) {
                // localStorage.setItem("userEmail", email);
                // localStorage.setItem("username", signupSuccess.username);
                // localStorage.setItem("isLoggedIn", true);
                // localStorage.setItem("userFirstName", signupSuccess.name);
                // dispatch(updateFirstName(firstName));
                // dispatch(updateLastName(lastName));
                // dispatch(updateUserName(username));
                // dispatch(updateEmail(email));
                const userFormData = {
                    firstName: firstName,
                    lastName: lastName,
                    userName: userName,
                    email: email,
                    isLoggedIn: true,
                };
                dispatch(updateAllData(userFormData));
                navigate('/home');
            } else {
                setDisplayError({ show: true, message: signupResult.response.data.message })
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
                { displayError.show === true && <h6 className='signupErrorMessage'>{displayError.message}</h6> }
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