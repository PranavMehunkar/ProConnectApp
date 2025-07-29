import UserLayout from '@/layout/UserLayout'
import React, { useEffect } from 'react'
import DashboardLayout from '@/layout/DashboardLayout'
import { useDispatch, useSelector } from 'react-redux'
import { AcceptConnection, getMyConnectionRequests } from '@/config/redux/action/authAction'
import { BASE_URL } from '@/config'
import styles from "./index.module.css"
import { useRouter } from 'next/router'

export default function MyConnectionsPage() {
  const dispatch = useDispatch()
  const authState = useSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      dispatch(getMyConnectionRequests({ token }))
    }
  }, [dispatch])

  const pendingConnections = authState.connectionRequest?.filter(conn => conn.status_accepted === null) || []
  const acceptedConnections = authState.connectionRequest?.filter(conn => conn.status_accepted !== null) || []

  return (
    <UserLayout>
      <DashboardLayout>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.7rem" }}>
          <h4>My Connections</h4>

          {pendingConnections.length === 0 ? (
            <h1>No Connection Request Pending</h1>
          ) : (
            pendingConnections.map((user, index) => (
              <div
                onClick={() => {
                  router.push(`/view_profile/${user.userId.username}`)
                }}
                className={styles.userCard}
                key={index}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.2rem",
                    justifyContent: "space-between"
                  }}
                >
                  <div className={styles.profilePicture}>
                    <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
                  </div>
                  <div className={styles.userInfo}>
                    <h3>{user.userId.name}</h3>
                    <p>{user.userId.username}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      dispatch(AcceptConnection({
                        connectionId: user._id,
                        token: localStorage.getItem("token"),
                        action: "accept"
                      }))
                    }}
                    className={styles.connectedButton}
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))
          )}

          <h4>My Network</h4>
          {acceptedConnections.length === 0 ? (
            <p></p>
          ) : (
            acceptedConnections.map((user, index) => (
              <div
                onClick={() => {
                  router.push(`/view_profile/${user.userId.username}`)
                }}
                className={styles.userCard}
                key={index}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.2rem",
                    justifyContent: "space-between"
                  }}
                >
                  <div className={styles.profilePicture}>
                    <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
                  </div>
                  <div className={styles.userInfo}>
                    <h3>{user.userId.name}</h3>
                    <p>{user.userId.username}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DashboardLayout>
    </UserLayout>
  )
}
