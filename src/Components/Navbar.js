import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext';
import { useThemeContext } from '../hooks/useThemeContext';

import styles from './Navbar.module.css'


export default function Navbar() {
    const { logout } = useLogout()
    const { user } = useAuthContext()
    const { color } = useThemeContext()
    return (
        <nav className={styles.navbar} style={{ background: color }}>
            <ul>
                {!user && (
                    <>
                        <li><button style={{background:color}}><Link to='/Login'>Login</Link></button></li>
                        <li><button style={{background:color}}><Link to='/Signup'>Signup</Link></button></li>
                    </>
                )}
                {user && (
                    <>
                        <li className={styles.title}>Hello, {user.displayName}</li>

                        <ul> 
                            <li>
                                <button style={{background:color}}><Link to='/Home'>Home</Link></button>
                            </li>
                            <li>
                                <button style={{background:color}}><Link to='/ScreenTimeGraphs'>My Data</Link></button>
                            </li>
                            <li>
                                <button style={{background:color}}><Link to='/Insights'>My Insights</Link></button>
                            </li>
                            <li>
                                <button style={{background:color}} onClick={logout}>Logout</button>
                            </li>
                        </ul>
                    </>
                )}
            </ul>
        </nav>
    );
}
