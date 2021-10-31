import styles from './styles.module.scss';
import { api } from '../../services/api';
import io from 'socket.io-client';
import logoImg from '../../assets/logo.svg';
import { useEffect, useState } from 'react';

type Message = {
    id: string;
    text: string;
    user: {
        name: string,
        avatar_url: string;
    }
}

const socket = io('http://localhost:3001');
const messagesQueue: Message[] = [];

socket.on('new_message', (data: Message) => {
    messagesQueue.push(data);
});

export function MessageList() {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        setInterval(() => {
            if (messagesQueue.length > 0) {
                setMessages(prevState => [
                    messagesQueue[0],
                    prevState[0],
                    prevState[1]
                ].filter(Boolean));

                messagesQueue.shift();
            }
        }, 3000);
    }, []);

    useEffect(() => {
        api.get<Message[]>('/messages/last3').then(response => {
            setMessages(response.data);
        });
    }, []);

    return (
        <div className={styles.messageListWrapper}>
            <img src={logoImg} alt="DoWhile 2021" />
            <ul className={styles.messageList}>
                {
                    messages.map(m => {
                        return (
                            <li className={styles.message} key={m.id}>
                                <p className={styles.messageContent}>{m.text}</p>
                                <div className={styles.messageUser}>
                                    <div className={styles.userImage}>
                                        <img src={m.user.avatar_url} alt={m.user.name} />
                                    </div>
                                    <span>{m.user.name}</span>
                                </div>
                            </li>
                        )
                    })
                }

            </ul>
        </div>
    )
}