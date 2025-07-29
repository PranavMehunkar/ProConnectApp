import React from 'react'
import styles from "./styles.module.css"
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { reset } from "@/config/redux/reducer/authReducer";

export default function NavbarComponent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
    dispatch(reset());
  };

  const isDashboard = authState.loggedIn && router.pathname.startsWith("/dashboard");

  return (
     <div className={styles.navbar}>
      <div className={styles.leftText} onClick={() => router.push("/")}>
        Pro Connect
      </div>

      <div className={styles.rightText}>
        {isDashboard ? (
          <>
            <span onClick={() => router.push("/profile")}>Profile</span>
            <span onClick={handleLogout}>Logout</span>
          </>
        ) : (
          <span onClick={() => router.push("/login")} className={styles.beApart}>Be a part</span>
        )}
      </div>
    </div>
  );
}
