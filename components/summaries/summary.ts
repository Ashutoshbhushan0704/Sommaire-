import { getDataConnection } from "@/lib/db";


export async function getSummaryById(id:string){
try {
  const sql = await getDataConnection();
  const [summary] = await sql `SELECT * from pdf_summaries whre id =${id}`;

  return summary;
    
} catch (error) {
    console.error('Error fetching summary by Id',error);
    return null;
}
}