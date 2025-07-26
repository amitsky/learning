import React, { useEffect, useRef, useState } from 'react'
import { auth, db } from '../firebase'
import { addDoc, collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import Message from './Message'

const Chat = ({ room, setCurrentRoom }) => {
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('') // this is input.

    const sendMessage = async () => {
        if (message.trim() === "") {
            alert('Enter the valid message')
            return;
        }
        const { uid, displayName, photoURL } = auth.currentUser;
        await addDoc(collection(db, room), {
            text: message,
            name: displayName,
            avatar: photoURL,
            createdAt: Date.now(),
            uid
        })
        setMessage('')
        // scroll to the bottom of messages.
        scrollRef.current.scroll({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }

    useEffect(() => {
        const q = query(
            collection(db, room),
            orderBy("createdAt"),
            limit(50)
        )
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            let theseMessages = [];
            QuerySnapshot.forEach((doc) => {
                theseMessages.push({ ...doc.data(), id: doc.id })
            })
            setMessages(theseMessages)
        })
        return () => unsubscribe;
    }, [])

    useEffect(() => {
        scrollRef.current.scroll({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages])

    let scrollRef = useRef(null)
    return (
        <div className='mt-4 w-full border-2 bg-slate-200 shaow-xl rounded-xl p-4 h-[80%] flex flex-col relative' >
            <div onClick={() => setCurrentRoom('')} className='absolute left-1 top-1 p-3 text-white bg-red-500 rounded-xl text-xm z-[30]'>
                Exit
            </div>
            <div className='w-full overflow-auto h-[90%] pt-10' ref={scrollRef}>
                {
                    messages?.map(curr => {
                        return (
                            <Message
                                key={curr.id}
                                userName={curr.name}
                                text={curr.text}
                                imageSource={curr.avatar}
                                isOfUser={auth.currentUser.displayName === curr.name}
                                createdAt={curr.createdAt}
                            />
                        )
                    })
                }
            </div>
            <div className='w-full rounded-lg text-sm flex justify-between absolute bottom-2 left-0 px-2 gap-2'>
                <input type="text" onKeyUp={(e) => {
                    if (e.key === 'Enter') sendMessage()
                }} onChange={(e) => setMessage(e.target.value)}
                    className='flex-1 p-3 overflow-auto border-2 rounded-xl'
                    autoFocus value={message} />
                <button onClick={sendMessage} className='border-2 p-3 rounded-xl bg-green-600 text-white'>
                    Send
                </button>
            </div>
        </div>
    )
}

export default Chat