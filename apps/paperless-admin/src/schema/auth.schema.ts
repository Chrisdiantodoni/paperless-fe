import { z } from "zod"

export const verifySSOTicketSchema = z.object({
  ticket: z.string(),
})
