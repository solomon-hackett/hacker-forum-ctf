"use client";
import { useState } from "react";

import { createPost } from "@/app/lib/actions";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

export default function CreateForm({
  id,
  redirect,
}: {
  id: string;
  redirect: string;
}) {
  const [titleDialogue, updateTitleDialogue] = useState("");
  const [contentDialogue, updateContentDialogue] = useState("");
  const [select, updateSelect] = useState(true);
  const [isOpen, updateIsOpen] = useState(false);

  function handleTitleDialogue(value: string) {
    if (!value) {
      updateTitleDialogue("Please enter a title.");
      return;
    }
    updateTitleDialogue("");
  }

  function handleContentDialogue(value: string) {
    if (!value) {
      updateContentDialogue("Please enter a title.");
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
    <form action={createPost}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          onChange={(e) => handleTitleDialogue(e.target.value)}
          onBlur={(e) => handleTitleDialogue(e.target.value)}
        />
        <p className="text-content-danger">{titleDialogue}</p>
      </div>
      <div>
        <label htmlFor="content">Content</label>
        <textarea
          name="content"
          id="content"
          onChange={(e) => handleContentDialogue(e.target.value)}
          onBlur={(e) => handleContentDialogue(e.target.value)}
        ></textarea>
        <p className="text-content-danger">{contentDialogue}</p>
      </div>
      <div>
        <input type="hidden" name="public" value={select.toString()} />
        <button
          className="flex flex-row justify-center items-center gap-1"
          onClick={handleDropdown}
          type="button"
        >
          {select ? "Public" : "Private"}
          {isOpen ? (
            <ChevronUpIcon className="w-5 h-5" />
          ) : (
            <ChevronDownIcon className="w-5 h-5" />
          )}
        </button>
        <button
          className={isOpen ? "block" : "hidden"}
          onClick={() => updateOption(true)}
          type="button"
        >
          Public
        </button>
        <button
          className={isOpen ? "block" : "hidden"}
          onClick={() => updateOption(false)}
          type="button"
        >
          Private
        </button>
      </div>
      <input type="hidden" name="author" value={id} />
      <input type="hidden" name="redirect" value={redirect} />
      <button type="submit">Post</button>
    </form>
  );
}
