"use server"
import { getDataConnection } from "@/lib/db";
import { generateSummaryFromGemini } from "@/lib/geminiai";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { generateSummaryFromOpenAi } from "@/lib/openai";
import { formatFileNameAsTitle } from "@/utils/formate-utils";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Sumana } from "next/font/google";
import { title } from "process";


interface PdfSummaryType{
    userId?:string, fileUrl: string, summary:string, title:string,fileName:string

}

export async function  getPdfText({
    fileUrl,
    fileName,
}:{
    fileUrl : string;
    fileName: string;
}) {
    if(!fileUrl){
        return {
            success: false,
            message: 'File upload Failed',
            data: null,
        };
    }
}
    



export async function generatePdfSummary({
    fileUrl,
    fileName,
}:{
    fileName:string;
    fileUrl:string;
})
     {
    if(!fileUrl){
        return {
            success:false,
            message: 'File upload failed',
            data: null,
        };
    }
   

if(!fileUrl){
    return{
        success: false,
        message: ' file upload failed',
        data: null,
    };
}

 try {
    const pdfText = await fetchAndExtractPdfText(fileUrl);
    console.log({pdfText});

     let summary;

  try {
     summary = await generateSummaryFromGemini(pdfText);
    console.log({summary})
  } catch (error) {
    console.log(error);

    // call gemini 
     if (error instanceof Error && error.message ==='RATE_LIMIT_EXCEEDED'){
        try {
            summary = await generateSummaryFromGemini(pdfText);
            
        } catch (geminiError) {
           console.log('Gemini API failed after OPenAI quote exceeded ', geminiError)             
        };
        throw new Error('Failed to generate sumamry')
     }
    
  }
   if(!summary){
    return {
        success: false,
        message:'failed to genarte summary',
         data: null,
    }
    

   }

const formattedFileName = formatFileNameAsTitle
(fileName);


   return {
    success: true,
    message:'Successfully generate summary',
    data: {
        title:formattedFileName,
        summary,
    },
   }


 } catch (error) {
    return {
    success: false,
    message: ' file upload failed',
    data: null,
 };

}
}

async function  SavedPdfSummary ({userId, fileUrl, summary, title, fileName}:PdfSummaryType) {
    // sql inserting pdf summary

    try {
        const sql = await getDataConnection();
        await sql `INSERT INTO pdf_summaries(user_id,
        original_file_url,  
summary_text,  

title,  
file_name  
) VALUES (  
     ${userId},
     ${fileUrl},
     ${summary},
     ${title},
     ${fileName}
        );`
    } catch (error) {
        console.log('Error saving PDF summary ', error);
        throw error;
        
    }
    
}

export async function storePdfSummaryAction({
    
    fileUrl,
    summary,
    title,
    fileName,
}:PdfSummaryType) {

    // user is logged in and has a userId
    // savePdfSummary
    // SavedPdfSummry()

let savedSummary : any ;


    try {
       const {userId} = await auth();
       if(!userId){
         return {
        success: false,
        message: 'User not found',
       };
    }
      savedSummary = await SavedPdfSummary({
        userId,
        fileUrl,
        summary,
        title,
        fileName,
    });
     if(!savedSummary){
        return{
            success: false,
            message:'false to save PDF summary,please try again '
        };

     }

    } catch (error) {
         return{
            success: false,
            message:  error instanceof Error ? error.message: 'Error saving PDF summary',
            
         }
        
    }
    // revalidating our cache
    // revalidatepath('/')
    revalidatePath(`/summaries/${savedSummary.id}`);
    
    return {
        success: true,
        message: 'PDF summary saved successfully',
         data:{
            id: savedSummary.id,
         }
      };


}
