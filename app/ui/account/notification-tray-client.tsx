"use client";

import { useState, useTransition } from "react";

import { markNotisAsRead } from "@/app/lib/actions";
import { Notification } from "@/app/lib/definitions";
import {
  ExclamationCircleIcon,
  InboxIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function NotificationTrayClient({
  notifications,
  id,
}: {
  notifications: Notification[];
  id: string | undefined;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [localNotifs, setLocalNotifs] = useState(notifications);
  const [isPending, startTransition] = useTransition();

  const markAllAsRead = () => {
    if (!id) return;

    setLocalNotifs((prev) => prev.map((n) => ({ ...n, is_read: true })));

    startTransition(() => {
      markNotisAsRead(id);
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .notif-wrapper {
          font-family: 'Sora', sans-serif;
          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 16px;

          position: relative;
          display: inline-flex;
          width: fit-content;

          padding: 0.5rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .notif-wrapper:hover {
          border-color: #3d4155;
          box-shadow: 0 8px 32px rgba(0,0,0,.4);
        }

        .notif-btn {
          background: transparent;
          border: none;
          color: #e8eaf2;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notif-panel {
          position: absolute;
          top: calc(100% + 0.75rem);
          right: 0;

          width: 340px;
          padding: 0.75rem;

          background: rgba(19, 21, 28, 0.95);
          border: 1px solid #2a2d3a;
          border-radius: 14px;

          backdrop-filter: blur(10px);

          display: flex;
          flex-direction: column;
          gap: 0.75rem;

          opacity: 0;
          transform: translateY(-8px) scale(0.98);
          pointer-events: none;

          transition: opacity 0.18s ease, transform 0.18s ease;
          z-index: 50;
        }

        .notif-panel.open {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }

        .notif-header {
          display: flex;
          justify-content: space-between;
          align-items: center;

          padding-bottom: 0.5rem;
          border-bottom: 1px solid #2a2d3a;
        }

        .notif-header-title {
          font-size: 0.85rem;
          color: #e8eaf2;
          font-weight: 600;
        }

        .notif-mark-all {
          font-size: 0.7rem;
          color: #5b9cf6;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .notif-mark-all:hover {
          color: #7c6dfa;
        }

        .notif-card {
          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 12px;
          padding: 0.9rem;

          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .notif-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: #e8eaf2;
          margin: 0;
        }

        .notif-content {
          font-size: 0.78rem;
          color: #9096b8;
          margin: 0;
        }

        .notif-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .notif-date {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          color: #6b7091;
        }

        .notif-unread {
          display: flex;
          align-items: center;
          gap: 0.3rem;

          font-size: 0.6rem;
          padding: 2px 6px;
          border-radius: 6px;

          color: #ef9f27;
          background: rgba(239,159,39,.1);
          border: 1px solid rgba(239,159,39,.2);

          font-family: 'DM Mono', monospace;
        }

        .notif-empty {
          padding: 1.5rem;
          text-align: center;
          font-size: 0.8rem;
          color: #6b7091;
        }
      `}</style>

      <div className="notif-wrapper">
        <button className="notif-btn" onClick={() => setIsOpen((p) => !p)}>
          {isOpen ? (
            <XMarkIcon className="w-5 h-5" />
          ) : (
            <InboxIcon className="w-5 h-5" />
          )}
        </button>

        <div className={`notif-panel ${isOpen ? "open" : ""}`}>
          <div className="notif-header">
            <span className="notif-header-title">Notifications</span>

            <button
              className="notif-mark-all"
              onClick={markAllAsRead}
              disabled={isPending}
            >
              {isPending ? "Updating..." : "Mark all as read"}
            </button>
          </div>

          {localNotifs.length === 0 ? (
            <div className="notif-empty">No notifications yet.</div>
          ) : (
            localNotifs.map((n) => (
              <div key={n.id} className="notif-card">
                <h3 className="notif-title">{n.title}</h3>
                <p className="notif-content">{n.content}</p>

                <div className="notif-footer">
                  <span className="notif-date">{n.created_at}</span>

                  {!n.is_read && (
                    <span className="notif-unread">
                      <ExclamationCircleIcon className="w-4 h-4" />
                      NEW
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
