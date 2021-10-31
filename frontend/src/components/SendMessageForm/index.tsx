import { FormEvent, useContext, useState } from 'react';
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc';
import { AuthContext } from '../../contexts/auth';
import { api } from '../../services/api';
import styles from './styles.module.scss';

export function SendMessageForm() {
    const { user, signOut } = useContext(AuthContext);
    const [message, setMessage] = useState('');

    function handleSendMessage(e: FormEvent) {
        e.preventDefault();

        if (!message.trim()) {
            return;
        }

        api.post('/messages', { text: message })
            .then(response => setMessage(''))
            .catch(e => console.log(e))
    }

    return (
        <div className={styles.sendMessageFormWrapper}>
            <button onClick={signOut} className={styles.signOutButton}>
                <VscSignOut size="32" />
            </button>

            <header className={styles.userInformation}>
                <div className={styles.userImage}>
                    <img src={user?.avatar_url} alt={user?.name} />
                </div>
                <strong className={styles.userName}>{user?.name}</strong>
                <span className={styles.userGithub}>
                    <VscGithubInverted size="16" />
                    {user?.login}
                </span>
            </header>

            <form onSubmit={handleSendMessage} className={styles.sendMessageForm}>
                <label htmlFor="message">Message</label>
                <textarea
                    name="message"
                    id="message"
                    placeholder="Qual é a sua expectativa para o evento?"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                />
                <button type="submit">Enviar Messagem</button>
            </form>
        </div>
    )
}