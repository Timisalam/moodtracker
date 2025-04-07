import { useAuthContext } from '../../hooks/useAuthContext'
import { useCollection } from '../../hooks/useCollection'
import { Link } from 'react-router-dom';

// styles
import styles from './Home.module.css'

// components
import ScreenTimeForm from './ScreenTimeForm'

export default function Home() {
    const { user } = useAuthContext()

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <ScreenTimeForm uid={user.uid} />
            </div>
        </div>
    )
}