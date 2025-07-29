import UserLayout from '@/layout/UserLayout'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styles from "./style.module.css";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/config/redux/action/authAction';
import { registerUser } from '@/config/redux/action/authAction';
import { emptyMessage } from '@/config/redux/reducer/authReducer';
import NavbarComponent from '@/Components/Navbar';

function LoginComponent() {


  const authState=useSelector((state)=> state.auth)

  const router=useRouter();

  const dispatch=useDispatch();

  const [userLoginMethod, setUserLoginMethod] = useState(false);

  const [email,setEmailAddress]=useState("");
  const [password,setPassword]=useState("");
  const [username,setUsername]=useState("");
  const [name,setName]=useState("");

  useEffect(()=> {
     if(authState.loggedIn) {
      router.push("/dashboard")
     }
  }, [authState.loggedIn])

  useEffect(()=> {
    dispatch(emptyMessage());
  },[userLoginMethod])

const handleRegister = () => {
  if (!email || !password || !username || !name) {
    alert("All fields are required for registration.");
    return;
  }

  dispatch(registerUser({ username, password, email, name }));
};


 const handleLogin = () => {
  if (!email || !password) {
    alert("Email and Password are required for login.");
    return;
  }

  dispatch(loginUser({ email, password }));
};


  return (
   <UserLayout>
     <NavbarComponent/>
  
     <div className={styles.container}>
    
     <div className={styles.cardContainer}>

      <div className={styles.cardContainer_left}>
        <h2 className={styles.formHeading}>
         {userLoginMethod ? "Sign In" : "Sign Up"}
        </h2>
        
            {authState.message && (
            <p style={{ color: authState.isError ? "red" : "green" }}>
            {typeof authState.message === "string"
            ? authState.message
            : authState.message.message || "Something went wrong"}
            </p>
            )}
    
            <div className={styles.inputContainers}>
                {!userLoginMethod && <div className={styles.inputRow}>
                   <input onChange={(e)=>setUsername(e.target.value)} className={styles.inputField} type="text" placeholder='Username'/>
                   <input onChange={(e)=>setName(e.target.value)} className={styles.inputField} type="text" placeholder='Name'/>

                </div>}
                <input onChange={(e)=>setEmailAddress(e.target.value)} className={styles.inputField} type="text" placeholder='Email'/>

                <input onChange={(e)=>setPassword(e.target.value)} className={styles.inputField} type="text" placeholder='Password'/>

                 <div onClick={()=> {
                  if(userLoginMethod) {
                    handleLogin();
                  } else {
                    handleRegister();
                  }
                 }} className={styles.buttonWithOutline}>
                  <p>{userLoginMethod ? "Sign In" : "Sign Up"}</p>
                 </div>
            </div>
  
      </div>

      <div className={styles.cardContainer_right}>
          {userLoginMethod ? <p>Don't Have an Account?</p>: <p>Already Have an Account?</p>}
          <div onClick={()=> {
                setUserLoginMethod(!userLoginMethod)
                }} style={{color:"black",textAlign:"center"}} className={styles.buttonWithOutline}>
                <p>{userLoginMethod ? "Sign Up" : "Sign In"}</p>
          </div>
      </div>
     </div>
    </div>
   </UserLayout>
  )
}

export default LoginComponent
