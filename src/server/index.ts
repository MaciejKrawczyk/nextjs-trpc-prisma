import {publicProcedure, router} from "@/server/trpc";

import { db } from '@/lib/db/db'
import { z } from 'zod'

export const appRouter = router({
  
  getTodos: publicProcedure.query(async () => {
    return db.todos.findMany();
  }),
  
  addTodo: publicProcedure.input(z.string()).mutation(async (opts) => {
    return db.todos.create({
      data: {
        content: opts.input,
        done: false
      }
    });
  }),
  
  setDone: publicProcedure
    .input(
      z.object({
        id: z.number(),
        done: z.boolean()
      })
    )
    .mutation(async (opts) => {
      return db.todos.update({
        where: {
          id: opts.input.id
        },
        data: {
          done: opts.input.done
        }
      })
    })
  
})


export type AppRouter = typeof appRouter