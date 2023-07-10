import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const useUser = () => {
    // Default not logged in state. User is null and loading is true.
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // If Firebase suddenly receives a change in user authentication, that user is set to user, and loading is turned off.
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(), user => {
            setUser(user);
            setIsLoading(false);
        })

        return unsubscribe;
    }, []);

    return { user, isLoading };
}

export default useUser;