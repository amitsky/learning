import { useState } from 'react'
import './App.css'
import { auth, db } from './firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { GoogleAuthProvider, signInWithPopup, reauthenticateWithPopup, deleteUser } from 'firebase/auth'
import { addDoc, deleteDoc , doc, collection, getFirestore } from 'firebase/firestore'
import Chat from './components/Chat'
import RoomForm from './components/RoomForm'

function App() {
  const [user] = useAuthState(auth)
  const [currentRoom, setCurrentRoom] = useState('')

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    const { uid, displayName, photoURL } = await auth.currentUser;
    await addDoc(collection(db, "Users"), {
      name: displayName,
      avatar: photoURL,
      createdAt: Date.now(),
      uid
    });
  }

  const signOut = async() => {
    // const provider = new GoogleAuthProvider();
    // await reauthenticateWithPopup(user, provider);
    // await deleteUser(user);
    auth.signOut()
  }

  return (
    <div className='text-xl w-full h-screen px-[5%] text-center font-semibold flex flex-col'>
      <div className='flex justify-between w-full h-auto items-center'>
        {/* <h1 className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-900'>Learning App</h1> */}
        {
          // user && <h2>Welcome User</h2>
        }
        {
          user ? (
            <button onClick={signOut} className='border-black border-2 rounded-xl font-bold p-4 text-center w-[13rem]'>
              Sign Out
            </button>
          ) : (
            <button onClick={googleSignIn} className='border-black border-2 rounded-xl font-bold p-4 text-center w-[13rem]'>
              Sign in
            </button>
          )
        }
      </div>
      {
        !user && <div className='w-full h-[25rem] flex justify-center items-center font-bold text-5xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-red-800'>
          Welcome to Learning Platform
        </div>
      }
      {
        user && currentRoom && <Chat setCurrentRoom={setCurrentRoom} room={currentRoom} />
      }
      {
        user && !currentRoom && <RoomForm setCurrentRoom={setCurrentRoom} />
      }
    </div>
  )
}

export default App
