// app/actions.ts
"use server";
import { neon } from "@neondatabase/serverless";

export async function getDataConnection() {
     if(!process.env.DATABASE_URL){
         throw new Error ('Neon Database Url  is not defiened')

     }
    const sql = neon(process.env.DATABASE_URL);
    return sql;
   
    
}