import React, { forwardRef, useRef, useState } from "react";
import { auth } from "../firebase";

const Message = forwardRef(
  ({ id, isOfUser, text, userName, createdAt, readBy, replyTo, onReply, scrollToMessage }, ref) => {
    const touchRef = useRef({ startX: 0, startY: 0, active: false });
    const [offset, setOffset] = useState(0);

    const createdTime = createdAt?.seconds
      ? new Date(createdAt.seconds * 1000)
      : new Date(createdAt ?? Date.now());

    let tickIcon = null;
    let seenTime = null;
    if (isOfUser) {
      const readers = Object.entries(readBy || {}).filter(
        ([uid]) => uid !== auth.currentUser?.uid
      );
      if (readers.length === 0) {
        tickIcon = <span className="text-gray-400 text-[0.65rem]">✓</span>;
      } else {
        const latestSeen = new Date(
          readers.map(([_, ts]) => new Date(ts)).sort((a, b) => b - a)[0]
        );
        seenTime = latestSeen.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        tickIcon = <span className="text-blue-500 text-[0.65rem] -mb-[2px]">✓✓</span>;
      }
    }

    // Swipe handlers
    const SWIPE_THRESHOLD = 60;
    const MAX_DRAG = 120;

    const handleTouchStart = (e) => {
      const t = e.touches[0];
      touchRef.current = { startX: t.clientX, startY: t.clientY, active: true };
    };
    const handleTouchMove = (e) => {
      if (!touchRef.current.active) return;
      const t = e.touches[0];
      const dx = t.clientX - touchRef.current.startX;
      const dy = t.clientY - touchRef.current.startY;
      if (Math.abs(dy) > 15 && Math.abs(dy) > Math.abs(dx)) {
        touchRef.current.active = false;
        return;
      }
      if ((!isOfUser && dx > 0) || (isOfUser && dx < 0)) {
        const clamped = Math.max(Math.min(dx * 0.6, MAX_DRAG), -MAX_DRAG);
        setOffset(clamped);
      }
    };
    const handleTouchEnd = (e) => {
      if (!touchRef.current.active) return;
      const dx = e.changedTouches[0].clientX - touchRef.current.startX;
      const triggered =
        Math.abs(dx) > SWIPE_THRESHOLD &&
        ((!isOfUser && dx > 0) || (isOfUser && dx < 0));
      if (triggered) onReply?.();
      setOffset(0);
      touchRef.current.active = false;
    };

    return (
      <div
        ref={ref}
        className={`w-full flex mb-1 px-3 sm:px-4 ${isOfUser ? "justify-end" : "justify-start"}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`flex flex-col max-w-[98%] ${isOfUser ? "items-end" : "items-start"}`}
          style={{ transform: `translateX(${offset}px)` }}
        >
          {/* Bubble */}
          <div
            className={`relative inline-block min-w-[60px] px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 rounded-2xl shadow-md break-words text-left ${
              isOfUser
                ? "bg-[#DCF8C6] text-gray-900 rounded-br-none dark:bg-[#054640] dark:text-white"
                : "bg-white text-gray-900 rounded-bl-none dark:bg-[#202C33] dark:text-white"
            }`}
          >
            {replyTo && (
              <div
                className="mb-1 text-xs text-gray-700 dark:text-gray-300 border-l-2 border-blue-400 pl-2 truncate max-w-[250px] cursor-pointer"
                onClick={() => scrollToMessage(replyTo.id)}
              >
                <span className="truncate block">{replyTo.text}</span>
              </div>
            )}
            <p className="whitespace-pre-wrap text-sm sm:text-base md:text-lg">{text}</p>
          </div>

          {/* Sent time */}
          <div className={`flex mt-1 text-[0.65rem] sm:text-xs ${isOfUser ? "justify-end" : "justify-start"}`}>
            <span className="text-gray-500 dark:text-gray-300">
              {createdTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>

          {/* Seen ticks + time */}
          {isOfUser && tickIcon && (
            <div className="flex mt-0.5 text-[0.65rem] sm:text-xs justify-end items-center gap-1">
              {tickIcon}
              {seenTime && <span className="text-gray-500 dark:text-gray-300">{seenTime}</span>}
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default Message;
