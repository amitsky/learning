import React from 'react'
import { auth } from '../firebase'

const Message = ({
    isOfUser = false,
    text = 'initially empty',
    userName = 'empty',
    createdAt,
    readBy
}) => {
    const formatDateTime = (isoString, isMobile = false) => {
        if (!isoString) return ""
        const dateObj = new Date(isoString)
        if (isMobile) {
            return dateObj.toLocaleDateString([], { month: '2-digit', day: '2-digit' }) +
                ' ' +
                dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        return dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
            ', ' +
            dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const createdTime = createdAt?.seconds
        ? new Date(createdAt.seconds * 1000)
        : new Date(createdAt)

    let readStatus = "Sent"
    let readTimeMobile = ""
    let readTimeDesktop = ""
    if (isOfUser && readBy) {
        const readers = Object.entries(readBy).filter(([uid]) => uid !== auth.currentUser?.uid)
        if (readers.length > 0) {
            if (readers.length === 1) {
                readTimeMobile = formatDateTime(readers[0][1], true)
                readTimeDesktop = formatDateTime(readers[0][1], false)
                readStatus = `Seen at ${readTimeDesktop}`
            } else {
                readStatus = `Seen by ${readers.length} people`
            }
        }
    }

    return (
        <div className={`w-full flex flex-col mb-3 px-3 sm:px-4 ${isOfUser ? 'items-end' : 'items-start'}`}>
            
            {/* Message bubble */}
            <div
                className={`relative max-w-[85%] sm:max-w-[70%] md:max-w-[60%] lg:max-w-[50%] 
                            px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 
                            rounded-2xl shadow-md
                            ${isOfUser 
                                ? 'bg-green-600 text-white rounded-br-none dark:bg-green-500' 
                                : 'bg-gray-200 text-gray-900 rounded-bl-none dark:bg-gray-700 dark:text-gray-100'
                            }`}
            >
                {/* Username (for group chats, only if not user) */}
                {/* {!isOfUser && (
                    <p className="text-[0.65rem] sm:text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        {userName}
                    </p>
                )} */}

                {/* Message text */}
                <p className="whitespace-pre-wrap break-words text-sm sm:text-base md:text-lg">
                    {text}
                </p>
            </div>

            {/* Timestamp + Read Receipts below bubble */}
            <div className={`mt-1 flex flex-col ${isOfUser ? 'items-end' : 'items-start'}`}>
                {/* Sent time */}
                <span className={`text-[0.65rem] sm:text-xs md:text-sm 
                    ${isOfUser ? "text-gray-400 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"}`}>
                    {createdTime.toLocaleDateString([], { month: '2-digit', day: '2-digit' }) +
                     ' ' +
                     createdTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>

                {/* Read receipts */}
                {isOfUser && (
                    <>
                        {/* Mobile short */}
                        {readTimeMobile && (
                            <span className="text-[0.65rem] text-blue-400 dark:text-blue-300 sm:hidden">
                                Seen {readTimeMobile}
                            </span>
                        )}
                        {/* Tablet/Desktop full */}
                        <span className="hidden sm:block text-xs md:text-sm text-blue-400 dark:text-blue-300">
                            {readStatus}
                        </span>
                    </>
                )}
            </div>
        </div>
    )
}

export default Message
