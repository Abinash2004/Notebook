import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Signin = (props) => {

  const [credentials,setCredentials] = useState({email:"", password:""});
  let history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: credentials.email, password: credentials.password }),
    });
    const json = await response.json();
    console.log(json);
    if(json.success) {
      localStorage.setItem('token', json.authToken);
      history("/home");
      props.showAlert("Logged In Successfully", "success");
      //redirect
    } else {
      props.showAlert("Invalid Credentials", "danger");
    }
  }
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }
  return (
    <div className='container'>
      <h2>Sign In to continue to Notebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" name='email' id="email" value={credentials.email} aria-describedby="emailHelp" onChange={onChange}/>
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" name='password' className="form-control" value={credentials.password} onChange={onChange} id="password" />
        </div>
        <button type="submit" className="btn btn-primary" >Signin</button>
      </form>
    </div>
  )
}

export default Signin
