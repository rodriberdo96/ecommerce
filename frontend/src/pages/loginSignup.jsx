import  React, { useState } from 'frontend\node_modules\react\\index.js'
import './Css/LoginSignup.css'

const LoginSignup = () => {
  const [state, setState] =useState('Login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const changeHandler = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const login = async () => {
    let responseData;
    await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
    }).then(response => response.json()).then(data => responseData = data);
    if(responseData.success){
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace('/');
    }
    else{
      alert(responseData.message);
    }
    
  }
  const signup = async () => {
    console.log("signup done",formData);
    let responseData;
    await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
    }).then(response => response.json()).then(data => responseData = data);
    if(responseData.success){
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace('/');
    }
    else{
      alert(responseData.message);
    }
  }
  
  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state==="Login"?<></>:<input type="text" name='username' value={formData.username} onChange={changeHandler} placeholder='Your Name' />}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Email Adress' />
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Password' />
        </div>
        <button onClick={()=> {state==="Login"?login():signup()}}>Continue</button>
        {state==="Login" ? <p className='loginsignup-login'>Create an account? <span onClick={()=>{setState("Sign up")}}>Click Here</span></p>:<p className='loginsignup-login'>Already have an account? <span onClick={()=>{setState("Login")}}>Log In</span></p>  
        }
        
        <div className="loginsignup-agree">
          <input type="checkbox" name='' id='' />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup