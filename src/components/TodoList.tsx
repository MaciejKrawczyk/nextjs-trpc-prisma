"use client"
import { trpc } from '@/trpc/client'
import {useState} from "react";

export default function TodoList() {
  
  const getTodos = trpc.getTodos.useQuery();
  const addTodo = trpc.addTodo.useMutation({
    onSettled: () => {
      getTodos.refetch()
    }
  });
  
  const [content, setContent] = useState("")
  
  return (
    <div>
      <div>
        {JSON.stringify(getTodos.data)}
        <div>
          
          <label htmlFor="content">Content</label>
          <input
            id={"content"}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            type="text"
            className={"text-black"}
          />
          <button onClick={async () => {
            if (content.length) {
              addTodo.mutate(content)
              setContent("");
          }}}>Add Todoo</button>
        </div>
      </div>
    </div>
  )
  
}