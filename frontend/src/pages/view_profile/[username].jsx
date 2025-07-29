import clientServer from '@/config';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import styles from "./index.module.css";
import { BASE_URL } from '@/config';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { sendConnectionRequest, getConnectionsRequest, getMyConnectionRequests } from "@/config/redux/action/authAction";

export default function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);

  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);

  const [isConnectionNull,setIsConnectionNull]=useState(true);

  const getUsersPost = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      await dispatch(getAllPosts());
      await dispatch(getConnectionsRequest({ token:localStorage.getItem("token") }));
      await dispatch(getMyConnectionRequests({token:localStorage.getItem("token")}));
    }
  };

  useEffect(() => {
    if (postState?.posts) {
      const posts = postState.posts.filter(
        (post) => post.userId.username === router.query.username
      );
      setUserPosts(posts);
    }
  }, [postState?.posts, router.query.username]);

 
  useEffect(() => {
  const connection = authState?.connections?.find(
    (user) => user.connectionId._id === userProfile?.userId?._id
  );

  const pendingRequest = authState?.connectionRequest?.find(
    (req) => req.connectionId._id === userProfile?.userId?._id
  );

  if (connection) {
    setIsCurrentUserInConnection(true);
    setIsConnectionNull(connection.status_accepted === null);
  } else if (pendingRequest) {
    setIsCurrentUserInConnection(true);
    setIsConnectionNull(pendingRequest.status_accepted === null);
  } else {
    setIsCurrentUserInConnection(false);
  }
}, [
  authState.connections,
  authState.connectionRequest,
  userProfile?.userId?._id,
]);

  useEffect(() => {
    getUsersPost();
  }, []);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            {userProfile?.userId?.profilePicture && (
              <img
                className={styles.backDrop}
                src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                alt="backdrop"
              />
            )}
          </div>

          <div className={styles.profileContainer_details}>
            <div className={styles.profileContainer_flex}>
              <div style={{ flex: "0.8rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
                  <h2>{userProfile?.userId?.name || "User Name"}</h2>
                  <p style={{ color: "grey" }}>@{userProfile?.userId?.username || "username"}</p>
                </div>

                <div style={{display:"flex",alignItems:"center",gap:"1.2rem"}}>
                {isCurrentUserInConnection ? (
                <button className={styles.connectedButton}>
                {isConnectionNull ? "Pending" : "Connected"}
                </button>
                ) : (
                <button
                onClick={() => {
                if (userProfile?.userId?._id) {
                dispatch(
                sendConnectionRequest({
                token: localStorage.getItem("token"),
                user_id: userProfile.userId._id,
                })
                );
                } else {
                console.warn("User ID not loaded yet.");
                }
                }}
                className={styles.connectBtn}
                disabled={!userProfile?.userId?._id}
                >
                Connect
                </button>
                )}

                <div onClick={async ()=> {
                  const response=await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
                  window.open(`${BASE_URL}/${response.data.message}`,"_blank")
                }} style={{cursor:"pointer"}}>
                  <svg style={{width:"1.2em"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </div>
                </div>

                {userProfile?.bio && <p>{userProfile.bio}</p>}
              </div>

              <div style={{ flex: "0.2rem" }}>
                <h3>Recent Activity</h3>
                {userPosts.map((post) => (
                  <div key={post._id} className={styles.postCard}>
                    <div className={styles.card}>
                      <div className={styles.card_profileContainer}>
                        {post.media ? (
                          <img src={`${BASE_URL}/${post.media}`} alt="post media" />
                        ) : (
                          <div style={{ width: "3.4rem", height: "3.4rem" }}></div>
                        )}
                      </div>
                      <p>{post.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="workHistory">
            <h4>Work History</h4>

            <div className={styles.workHistoryContainer}>
             {userProfile?.pastWork?.map((work, index) => (
             <p key={index}
             style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem" }}
             >
             {work.company} - {work.position}
             </p>
             ))}

            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  const request = await clientServer.get("/user/get_profile_based_on_username", {
    params: {
      username: context.query.username
    }
  });

  return { props: { userProfile: request.data.profile } };
}
