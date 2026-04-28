"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

import { updatePost } from "@/app/lib/actions";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationCircleIcon,
  GlobeAltIcon,
  LockClosedIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

export default function EditForm({
  id,
  authorId,
  currentTitle,
  currentContent,
  isPublic,
}: {
  id: number;
  authorId: string;
  currentTitle: string;
  currentContent: string;
  isPublic: boolean;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(updatePost, null);
  const [titleDialogue, updateTitleDialogue] = useState("");
  const [contentDialogue, updateContentDialogue] = useState("");
  const [select, updateSelect] = useState<boolean>(isPublic ?? true);
  const [isOpen, updateIsOpen] = useState(false);

  const error = state === "ok" ? null : state;

  useEffect(() => {
    if (state === "ok") {
      router.push("/account/posts");
    }
  }, [state, router]);

  function handleTitleDialogue(value: string) {
    if (!value) {
      updateTitleDialogue("Please enter a title.");
      return;
    }
    updateTitleDialogue("");
  }

  function handleContentDialogue(value: string) {
    if (!value) {
      updateContentDialogue("Please enter some content.");
      return;
    }
    updateContentDialogue("");
  }

  function handleDropdown() {
    updateIsOpen(!isOpen);
  }

  function updateOption(value: boolean) {
    updateSelect(value);
    handleDropdown();
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .create-card {
          font-family: 'Sora', sans-serif;
          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 20px;
          padding: 2.5rem 2rem;
          width: 100%;
          max-width: 480px;
          position: relative;
          overflow: hidden;
        }
        .create-card::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(124,109,250,.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .create-card::after {
          content: '';
          position: absolute;
          bottom: -40px; left: -40px;
          width: 150px; height: 150px;
          background: radial-gradient(circle, rgba(91,156,246,.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .create-input,
        .create-textarea {
          width: 100%;
          background: #1a1d27;
          border: 1px solid #2a2d3a;
          border-radius: 10px;
          padding: 0.7rem 0.9rem 0.7rem 2.7rem;
          font-size: 0.875rem;
          font-family: 'Sora', sans-serif;
          color: #e8eaf2;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .create-textarea {
          resize: vertical;
          min-height: 120px;
          padding: 0.7rem 0.9rem 0.7rem 2.7rem;
          line-height: 1.6;
        }
        .create-input::placeholder,
        .create-textarea::placeholder {
          color: #6b7091;
          font-size: 0.8rem;
        }
        .create-input:focus,
        .create-textarea:focus {
          border-color: #7c6dfa;
          box-shadow: 0 0 0 3px rgba(124, 109, 250, 0.12);
        }
        .create-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 500;
          color: #6b7091;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .create-field-hint {
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem;
          margin-top: 0.4rem;
          padding: 0.35rem 0.65rem;
          border-radius: 7px;
          background: rgba(242, 111, 111, 0.08);
          border: 1px solid rgba(242, 111, 111, 0.22);
          color: #f26f6f;
          display: flex;
          align-items: center;
          gap: 6px;
          width: fit-content;
        }
        .create-form-error {
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem;
          margin-bottom: 1.25rem;
          padding: 0.5rem 0.75rem;
          border-radius: 7px;
          background: rgba(242, 111, 111, 0.08);
          border: 1px solid rgba(242, 111, 111, 0.22);
          color: #f26f6f;
          display: flex;
          align-items: center;
          gap: 6px;
          width: 100%;
          box-sizing: border-box;
        }
        .create-dropdown-trigger {
          background: #1a1d27;
          border: 1px solid #2a2d3a;
          border-radius: 10px;
          color: #e8eaf2;
          font-family: 'Sora', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.7rem 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
        }
        .create-dropdown-trigger:hover {
          border-color: #7c6dfa;
          box-shadow: 0 0 0 3px rgba(124, 109, 250, 0.12);
        }
        .create-dropdown-trigger[aria-expanded="true"] {
          border-color: #7c6dfa;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }
        .create-dropdown-menu {
          background: #1a1d27;
          border: 1px solid #7c6dfa;
          border-top: none;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
          overflow: hidden;
        }
        .create-dropdown-option {
          width: 100%;
          background: transparent;
          border: none;
          color: #a0a3b8;
          font-family: 'Sora', sans-serif;
          font-size: 0.875rem;
          padding: 0.65rem 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.15s, color 0.15s;
          text-align: left;
        }
        .create-dropdown-option:hover {
          background: rgba(124, 109, 250, 0.08);
          color: #e8eaf2;
        }
        .create-dropdown-option + .create-dropdown-option {
          border-top: 1px solid #2a2d3a;
        }
        .create-submit {
          background: linear-gradient(135deg, #7c6dfa, #5b9cf6);
          border: none;
          border-radius: 10px;
          color: #fff;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.75rem 2.5rem;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          letter-spacing: 0.01em;
          box-shadow: 0 4px 20px rgba(124, 109, 250, 0.25);
        }
        .create-submit:hover {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(124, 109, 250, 0.35);
        }
        .create-submit:active { transform: translateY(0); }
        .visibility-badge {
          margin-left: auto;
          font-size: 0.65rem;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.2rem 0.5rem;
          border-radius: 5px;
          background: rgba(124, 109, 250, 0.12);
          color: #7c6dfa;
        }
      `}</style>

      <form action={formAction} className="create-card">
        <h1
          style={{
            fontSize: "1.6rem",
            fontWeight: 600,
            color: "#e8eaf2",
            letterSpacing: "-0.02em",
            marginBottom: "0.4rem",
          }}
        >
          Edit post
        </h1>
        <p
          style={{
            fontSize: "0.8rem",
            color: "#6b7091",
            fontWeight: 300,
            marginBottom: "1.25rem",
          }}
        >
          Make changes and save when you&#39;re ready.
        </p>

        {/* Auto-mod notice */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "0.6rem",
            background: "rgba(91, 156, 246, 0.07)",
            border: "1px solid rgba(91, 156, 246, 0.2)",
            borderRadius: "10px",
            padding: "0.65rem 0.85rem",
            marginBottom: "2rem",
          }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              flexShrink: 0,
              marginTop: "0.05rem",
              color: "#5b9cf6",
            }}
          >
            ℹ
          </span>
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              color: "#5b9cf6",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Edited posts are re-reviewed by auto-mod before changes go live —
            please be patient.
          </p>
        </div>

        {/* Title */}
        <div style={{ marginBottom: "1.25rem" }}>
          <label htmlFor="title" className="create-label">
            Title
          </label>
          <div style={{ position: "relative" }}>
            <input
              className="create-input"
              type="text"
              name="title"
              id="title"
              placeholder="Give your post a title"
              defaultValue={currentTitle}
              onChange={(e) => handleTitleDialogue(e.target.value)}
              onBlur={(e) => handleTitleDialogue(e.target.value)}
            />
            <PencilIcon
              style={{
                position: "absolute",
                top: "50%",
                left: "0.75rem",
                transform: "translateY(-50%)",
                width: "1rem",
                height: "1rem",
                color: "#6b7091",
                pointerEvents: "none",
              }}
            />
          </div>
          {titleDialogue && (
            <p className="create-field-hint">
              <ExclamationCircleIcon
                style={{ width: 13, height: 13, flexShrink: 0 }}
              />
              {titleDialogue}
            </p>
          )}
        </div>

        {/* Content */}
        <div style={{ marginBottom: "1.25rem" }}>
          <label htmlFor="content" className="create-label">
            Content
          </label>
          <div style={{ position: "relative" }}>
            <textarea
              className="create-textarea"
              name="content"
              id="content"
              placeholder="Write your post content…"
              defaultValue={currentContent}
              onChange={(e) => handleContentDialogue(e.target.value)}
              onBlur={(e) => handleContentDialogue(e.target.value)}
            />
            <PencilIcon
              style={{
                position: "absolute",
                top: "0.85rem",
                left: "0.75rem",
                width: "1rem",
                height: "1rem",
                color: "#6b7091",
                pointerEvents: "none",
              }}
            />
          </div>
          {contentDialogue && (
            <p className="create-field-hint">
              <ExclamationCircleIcon
                style={{ width: 13, height: 13, flexShrink: 0 }}
              />
              {contentDialogue}
            </p>
          )}
        </div>

        {/* Visibility dropdown */}
        <div style={{ marginBottom: "2rem" }}>
          <label className="create-label">Visibility</label>
          <input type="hidden" name="public" value={select.toString()} />
          <button
            className="create-dropdown-trigger"
            onClick={handleDropdown}
            type="button"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            {select ? (
              <GlobeAltIcon
                style={{
                  width: "1rem",
                  height: "1rem",
                  color: "#7c6dfa",
                  flexShrink: 0,
                }}
              />
            ) : (
              <LockClosedIcon
                style={{
                  width: "1rem",
                  height: "1rem",
                  color: "#7c6dfa",
                  flexShrink: 0,
                }}
              />
            )}
            {select ? "Public" : "Private"}
            <span className="visibility-badge">
              {select ? "visible to all" : "only you"}
            </span>
            {isOpen ? (
              <ChevronUpIcon
                style={{
                  width: "1rem",
                  height: "1rem",
                  color: "#6b7091",
                  marginLeft: "4px",
                }}
              />
            ) : (
              <ChevronDownIcon
                style={{
                  width: "1rem",
                  height: "1rem",
                  color: "#6b7091",
                  marginLeft: "4px",
                }}
              />
            )}
          </button>
          {isOpen && (
            <div className="create-dropdown-menu" role="listbox">
              <button
                className="create-dropdown-option"
                onClick={() => updateOption(true)}
                type="button"
                role="option"
                aria-selected={select === true}
              >
                <GlobeAltIcon
                  style={{ width: "1rem", height: "1rem", flexShrink: 0 }}
                />
                Public
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "0.7rem",
                    fontFamily: "'DM Mono', monospace",
                    color: "#6b7091",
                  }}
                >
                  visible to all
                </span>
              </button>
              <button
                className="create-dropdown-option"
                onClick={() => updateOption(false)}
                type="button"
                role="option"
                aria-selected={select === false}
              >
                <LockClosedIcon
                  style={{ width: "1rem", height: "1rem", flexShrink: 0 }}
                />
                Private
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "0.7rem",
                    fontFamily: "'DM Mono', monospace",
                    color: "#6b7091",
                  }}
                >
                  only you
                </span>
              </button>
            </div>
          )}
        </div>

        <input type="hidden" name="postId" value={id} />
        <input type="hidden" name="author" value={authorId} />

        {/* Form-level error */}
        {error && (
          <div className="create-form-error">
            <ExclamationCircleIcon
              style={{ width: 13, height: 13, flexShrink: 0 }}
            />
            {error}
          </div>
        )}

        {/* Submit */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button type="submit" className="create-submit">
            Save changes
            <ArrowRightIcon style={{ width: "1rem", height: "1rem" }} />
          </button>
        </div>
      </form>
    </>
  );
}
