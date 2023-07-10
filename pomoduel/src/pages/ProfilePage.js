import { getAuth } from "firebase/auth";
import useUser from '../hooks/useUser';

const ProfilePage = () => {
    const { user } = useUser();
    return (
        <>
            {user
            ? (<>
                <br />
                <br />
                <h3>Your Profile</h3>
                <p>Username: {getAuth().currentUser.displayName}</p>
                <br />
                <p>Email: {getAuth().currentUser.email}</p>
                </>)
            : <p>You are not logged in! Only logged in users can view their profile.</p>}
        </>
    )
}

export default ProfilePage;