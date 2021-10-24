import styles from './style.module.scss';
import logoImage from '../../assets/logo.svg';
import { api } from '../../services/api'
import { useEffect, useState } from 'react';
import io from 'socket.io-client';


type Message = {
    id: string;
    text: string;
    user: {
        name: string;
        avatar_url: string;
    }
}

const messagesQueue: Message[] = [];//fila de messages

const socket = io('http://localhost:4000');
socket.on('new_message', (newMessage: Message) => {
    messagesQueue.push(newMessage);
})

export function MessageList() {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        setInterval(() => {
            if (messagesQueue.length > 0) {
                setMessages(prevState => [
                    messagesQueue[0],
                    prevState[0],
                    prevState[1],
                ].filter(Boolean))
                messagesQueue.shift();
            }
        }, 3000)
    }, [])


    useEffect(() => {
        api.get<Message[]>('messages/last3').then(response => {
            setMessages(response.data);
        })
    }, [])

    return (
        <div className={styles.messageListWrapper}>
            <img src={logoImage} alt="DoWhile2021" />

            <ul className={styles.messageList}>
                {messages.map(message => {
                    return (
                        <li key={message.id} className={styles.message}>
                            <p className={styles.messageContent}>{message.text}</p>
                            <div className={styles.messageUser}>
                                <div className={styles.userImage}>
                                    <img src={message.user.avatar_url} alt={message.user.name} />
                                </div>
                                <div className={styles.messageUser}>
                                    <span>{message.user.name}</span>
                                </div>
                            </div>
                        </li>
                    );
                })}



            </ul>
        </div>
    )
}