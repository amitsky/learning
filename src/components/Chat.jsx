import React, { useEffect, useRef, useState } from "react";
import { auth, db } from "../firebase";
import {
  addDoc,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import Message from "./Message";
import EmojiPicker from "emoji-picker-react";
import { Smile, SendHorizonal } from "lucide-react";

const Chat = ({ room, setCurrentRoom }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  const scrollRef = useRef(null);
  const pickerRef = useRef(null);
  const messageRefs = useRef({});

  const sendMessage = async () => {
    if (!message.trim()) return;
    const { uid, displayName, photoURL } = auth.currentUser;

    await addDoc(collection(db, room), {
      text: message,
      name: displayName,
      avatar: photoURL,
      createdAt: Date.now(),
      uid,
      readBy: { [uid]: new Date().toISOString() },
      replyTo: replyingTo
        ? { text: replyingTo.text, name: replyingTo.userName, id: replyingTo.id }
        : null,
    });

    setMessage("");
    setReplyingTo(null);
    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    const q = query(collection(db, room), orderBy("createdAt"), limit(50));
    const unsubscribe = onSnapshot(q, (snap) => {
      const msgs = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        msgs.push({ ...data, id: docSnap.id });
        if (auth.currentUser && !data.readBy?.[auth.currentUser.uid]) {
          updateDoc(doc(db, room, docSnap.id), {
            [`readBy.${auth.currentUser.uid}`]: new Date().toISOString(),
          });
        }
      });
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [room]);

  useEffect(() => {
    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  const onEmojiClick = (emojiData) => setMessage((prev) => prev + emojiData.emoji);

  const scrollToMessage = (msgId) => {
    const ref = messageRefs.current[msgId];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
      ref.current.classList.add("animate-pulse");
      setTimeout(() => ref.current.classList.remove("animate-pulse"), 800);
    }
  };

  return (
    <div className="mt-4 w-[96%] mx-auto border-2 bg-slate-200 shadow-xl rounded-xl p-2 h-[85vh] flex flex-col relative">
      {/* Exit Button */}
      <div
        onClick={() => setCurrentRoom("")}
        className="absolute left-1 top-1 p-3 text-white bg-red-500 rounded-xl z-[30] cursor-pointer"
      >
        Exit
      </div>

      {/* Messages */}
      <div className="w-full overflow-auto h-full pb-28" ref={scrollRef}>
        {messages.map((msg) => {
          if (!messageRefs.current[msg.id]) messageRefs.current[msg.id] = React.createRef();
          return (
            <Message
              key={msg.id}
              ref={messageRefs.current[msg.id]}
              id={msg.id}
              userName={msg.name}
              text={msg.text}
              createdAt={msg.createdAt}
              readBy={msg.readBy}
              replyTo={msg.replyTo}
              isOfUser={auth.currentUser.displayName === msg.name}
              onReply={() => setReplyingTo({ text: msg.text, userName: msg.name, id: msg.id })}
            />
          );
        })}
      </div>

      {/* Reply Preview */}
      {replyingTo && (
        <div
          onClick={() => scrollToMessage(replyingTo.id)}
          className="absolute bottom-16 left-2 right-2 bg-gray-100 dark:bg-gray-700 border-l-4 border-blue-400 pl-3 py-1 flex justify-between items-center rounded-r-xl z-20 cursor-pointer"
        >
          <div className="truncate max-w-[85%]">
            <span className="text-xs truncate block">{replyingTo.text}</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setReplyingTo(null); }}
            className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-300"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 px-2 py-2 bg-slate-100 rounded-t-lg z-10">
        <div className="flex items-center gap-2 flex-1 bg-white border-2 rounded-xl px-2 overflow-hidden">
          <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2 hover:bg-gray-100 flex-shrink-0">
            <Smile size={22} />
          </button>
          <input
            type="text"
            onKeyUp={(e) => e.key === "Enter" && sendMessage()}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 min-w-0 p-2 text-sm focus:outline-none"
            placeholder="Type a message..."
            value={message}
          />
        </div>
        <button onClick={sendMessage} className="w-[50px] h-[45px] flex items-center justify-center rounded-xl bg-green-600 text-white hover:bg-green-700 flex-shrink-0">
          <SendHorizonal size={22} />
        </button>
      </div>

      {showEmojiPicker && (
        <div ref={pickerRef} className="absolute bottom-20 left-2 z-50 bg-white border rounded-xl shadow-lg">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default Chat;
