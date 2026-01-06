import React, { useState } from "react";
import AboutBackground from "../../Assets/login-background.png";
import AboutBackgroundImage from "../../Assets/login-background-image.png";
import { signUp, login, forgotPassword } from "../../Services/user_service";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';


const Login_Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [role, setRole] = useState('');

  const navigate = useNavigate();


  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    console.log('Email:', email);
    console.log('Password:', password);

    const loginDetails = {
      email,
      password
    };

    login(loginDetails).then((resp) => {
      const token= Cookies.get('token');
      var decodedToken="";
      
      if (resp) {
        try {
          decodedToken = jwtDecode(resp);
          console.log("role : ",decodedToken.role);
        } catch (error) {
          console.error('Error decoding JWT:', error);
        }
      }
      if(decodedToken.role=='user')
        navigate('/products');
      else if(decodedToken.role=='admin')
        navigate('/admin');
      

    }).catch((error) => {
      console.log("Error from login :",error);
    });
  };

  const handleForgotPassword =()=>{
    const map= new Map();
    map.set('email',email);
    const payload = Object.fromEntries(map);

    forgotPassword(payload).then((resp)=>{
      console.log(resp);

      toast.success(resp.message,{
        position: "bottom-left",
        autoClose: 500,
        closeOnClick: true,
        theme: "dark",
      });
    })
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    console.log('Name', name);
    console.log('Email:', email);
    console.log('Contact:', contact);
    console.log('Password:', password);

    const signupDetails = new Map();
    signupDetails.set('name', name);
    signupDetails.set('email', email);
    signupDetails.set('contactNumber', contact);
    signupDetails.set('password', password);

    const payload = Object.fromEntries(signupDetails);

    signUp(payload).then((resp) => {
      console.log(resp);
      
      console.log("Success log");
      toast.success("User registered successfully",{
        position: "bottom-left",
        autoClose: 500,
        closeOnClick: true,
        theme: "dark",
      });

    }).catch((error) => {
      console.log(error);
      console.log("Error log")
      toast.error("Something went wrong",{
        position: "bottom-left",
        autoClose: 500,
        closeOnClick: true,
        theme: "dark",
      });
    })
  };


  const [action, setAction] = useState('');

  const registerLink = () => {
    setAction('active');
  };

  const loginLink = () => {
    setAction('');
  };



  return (
    <div className="login-section-container" >

      <div className="login-background-image-container">
        <img src={AboutBackground} alt="" />
      </div>

      <div className="login-section-image-container">
        <img src={AboutBackgroundImage} alt="" />
      </div>

      <div className={`container ${action}`} id="Login">

        <div className="login">
          <h1 className="primary-heading">
            Login.....
          </h1>
          <div className="form login-form">
            
            
            <form onSubmit={handleLoginSubmit}>
              <div>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="login_email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="login_password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit">Login</button>

            </form>
            <div className="form-links">
              <div><a href="#login" id="forgot-password" onClick={handleForgotPassword}><p > Forgot Password?</p></a> </div>
              <div><a href="#login" id="" onClick={registerLink}><p>Don't have an account?</p> </a></div>
            </div>
          </div>
        </div>


        <div className="registration">
          <h1 className="primary-heading">
            Registration....
          </h1>

          <div className="form register-form">
            <form onSubmit={handleRegisterSubmit}>
              <div>
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="contact">Mobile No.:</label>
                <input
                  type="text"
                  id="contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit">SignUp</button>
            </form>
            <div className="form-links">
              <div><a href="#login" id="" onClick={loginLink}><p > Already have an account? Click Here</p></a> </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login_Register;
