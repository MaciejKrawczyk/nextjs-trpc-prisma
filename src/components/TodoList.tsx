"use client"
import { trpc } from '@/trpc/client'
import {useState} from "react";
import {serverClient} from "@/trpc/serverClient";

export default function TodoList({ initialTodos } : { initialTodos: Awaited<ReturnType<typeof serverClient["getTodos"]>> }) {
  
  const getTodos = trpc.getTodos.useQuery(undefined, {
    initialData: initialTodos,
    refetchOnMount: false,
    refetchOnReconnect: false
  });
  const addTodo = trpc.addTodo.useMutation({
    onSettled: () => {
      getTodos.refetch()
    }
  });
  const setDone = trpc.setDone.useMutation({
    onSettled: () => {
      getTodos.refetch()
    }
  })
  
  const [content, setContent] = useState("")
  
  return (
    <div>
      <div className={'text-black my-5 text-3xl'}>
        {getTodos?.data?.map((todo) => (
          <div key={todo.id} className={'flex gap-3 items-center'}>
            <input
              id={`check-${todo.id}`}
              type="checkbox"
              checked={!!todo.done}
              style={{zoom: 1.5}}
              onChange={async () => {
                setDone.mutate({
                  id: todo.id,
                  done: !todo.done
                })
              }}
            />
            <label
              htmlFor={`check-${todo.id}`}
            >
              {todo.content}
            </label>
          </div>
        ))}
        <input
          id={"content"}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          type="text"
          className={"text-black"}
        />
        <label htmlFor="content">Content</label>
        <button onClick={async () => {
          if (content.length) {
            addTodo.mutate(content)
            setContent("");
        }}}>Add Todoo</button>
      </div>
    </div>
  )
  
}