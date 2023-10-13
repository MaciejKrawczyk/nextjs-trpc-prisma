"use client"
import { trpc } from '@/trpc/client'
import {useState} from "react";
import {serverClient} from "@/trpc/serverClient";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

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
            
            <Checkbox
              id={`check-${todo.id}`}
              checked={!!todo.done}
              style={{zoom: 1.5}}
              onChange={ () => {
                setDone.mutate({
                  id: todo.id,
                  done: !todo.done
                })
              }}
            />
            <Label htmlFor={`check-${todo.id}`}> {todo.content} </Label>
            
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
        <Input
          id={"content"}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          type="text"
          className={"text-black"}
        />
        
        <Button
          onClick={async () => {
            if (content.length) {
              addTodo.mutate(content)
              setContent("");
            }}}
        >Add Todoo</Button>
        
      </div>
    </div>
  )
  
}