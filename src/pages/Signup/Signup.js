import { useState } from 'react';
import { useSignup } from '../../hooks/useSignup';
import styles from './Signup.module.css'



export default function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [displayName, setdisplayName] = useState('')
    const {signup,isPending, error} = useSignup()

    const handleSubmit = (e) => {
        e.preventDefault()
        signup(email,password,displayName)
    }
    return (
        <form onSubmit={handleSubmit} className={styles['signup-form']}>
            <h2>Sign up</h2>
            <label>
                <span>UserName</span>
                <input
                    type='text'
                    onChange={(e) => setdisplayName(e.target.value)}
                    value={displayName}
                />
            </label>
            <label>
                <span>Email:</span>
                <input
                    type='email'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}

                />
            </label>
            <label>
                <span>Make password</span>
                <input
                    type='password'
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
            </label>
            {!isPending && <button className='btn'>Signup</button>}
            {isPending && <button className='btn' disabled>loading</button>}
            {error && <p>{error}</p>}
        </form>
    );
}
