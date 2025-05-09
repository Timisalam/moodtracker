import { useEffect, useState } from "react"
import { useAuthContext } from "./useAuthContext"
import { projectAuth } from "../firebase/config"
import { signOut } from "firebase/auth"

export const useLogout = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()

    const logout = async () => {
        setError(null)
        setIsPending(true)



        try {
            await signOut(projectAuth);


            dispatch({ type: 'LOGOUT' })

            if (!isCancelled) {
                setIsPending(false)
                setError(null)
            }

        }
        catch (err) {
            if (!isCancelled) {
                console.log(err.message)
                setError(err.message)
                setIsPending(false)
            }
        }
    }

    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])
    return { logout, error, isPending }

}
