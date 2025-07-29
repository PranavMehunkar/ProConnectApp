import React, { useEffect } from 'react'
import UserLayout from '@/layout/UserLayout'
import DashboardLayout from '@/layout/DashboardLayout'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers } from '@/config/redux/action/authAction'
import styles from "./index.module.css";
import { useRouter } from 'next/router'

export default function Discoverpage() {

    const authState=useSelector((state)=>state.auth)

    const dispatch=useDispatch();
    useEffect(()=> {
      if(!authState.all_profiles_fetched) {
        dispatch(getAllUsers());
      }
    },[])

    const router=useRouter();

  return (
   <UserLayout>
  
    <DashboardLayout>
      <div>
        <h1>Discover</h1>

        <div className={styles.allUserProfile}>

          {authState.all_profiles_fetched && Array.isArray(authState.all_users) && authState.all_users.map((user) => (
          <div
          key={user._id}
          onClick={() => router.push(`/view_profiles/${user.userId.username}`)}
          className={styles.userCard}
          >
          <img
          className={styles.userCard_image}
          src={`${BASE_URL}/${user.userId.profilePicture}`}
         alt="profile"
         />
         <div className={styles.userInfo}>
         <h3 className={styles.name}>{user.userId.name}</h3>
         <p className={styles.username}>{user.userId.username}</p>
        </div>
        </div>
         ))}
        </div>
      </div>
    </DashboardLayout>
    
    </UserLayout>
  )
}
