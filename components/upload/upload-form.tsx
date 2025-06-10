// 'use client'


// import UploadFormInput from "@/components/upload/upload-form-input";
// import { useUploadThing } from "@/utils/uploadthing";
// import { title } from "process";
// import z from 'zod';
// import { toast } from 'sonner';

// const schema = z.object({
//     file:z.instanceof(File,{message:'Invalid file'}).refine((file)=>file.size <= 20 * 1024 * 1024,{
//         message:'File size must me less than 20MB',
//     })
//     .refine((file)=>file.type.startsWith('application/pdf'), 'File must be a PDF'),
// });

// export default function UploadForm (){


//   const {startUpload, routeConfig} = useUploadThing('pdfUploader',{
//     onClientUploadComplete:()=>{
//         console.log('upload succesfully!');
//     },
//     onUploadError:(err) =>{
//         console.log('error occured while uploading',err);
//         toast({
//             title:'error occured while uploading',
//             description: err.message,
//         });
//     },
//     onUploadBegin :({file})=>{
//         console.log('upload has begun for',file);
//     },
//   })  ;

// const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
//     e.preventDefault();
    
//     const formData = new FormData(e.currentTarget);
//     const file = formData.get('file') as File;

//     // validating the fields
//     const validatedFileds = schema.safeParse({});
//     if(!validatedFileds.success){
//         console.log(validatedFileds.error.flatten().fieldErrors.file?.[0] ?? 'Invalid file');
//         toast({
//             title:'something went wrong',
//             variant:'destructive',
//             description: validatedFileds.error.flatten().fieldErrors.file?.[0]??'invalid file',
//         }) ;
//         return ;
//     }
//     toast({
//         title: 'processing',
//         description: 'hang tight! our AI is reading'
//     })
//     // scehma with zod
//     // upload the file to uploadthing
//     const resp = await startUpload([file]);
//  if(!resp) {
//     toast({
//         title:'Something went wrong',
//         description:'please use different file',
//         variant: 'destructive'
//     })
//     return ;
//  }
//     // parse the pdf 
//     // summarize the pdf using ai 
// };
//     return (
    
//     <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
        
//             <UploadFormInput  onSubmit={handleSubmit} />
        
//     </div>
//     );
// }

// second code 



// 'use client';
// import UploadFormInput from "@/components/upload/upload-form-input";

// import { useUploadThing } from "@/utils/uploadthing";
// import {z} from 'zod';
// import { toast } from 'sonner';

// const schema = z.object({
//   file: z.instanceof(File, { message: 'Invalid file' })
//     .refine((file) => file.size <= 20 * 1024 * 1024, {
//       message: 'File size must be less than 20MB',
//     })
//     .refine((file) => file.type.startsWith('application/pdf'), 'File must be a PDF'),
// });

// export default function UploadForm() {
//   const { startUpload } = useUploadThing('pdfUploader', {
//     onClientUploadComplete: () => {
//       console.log('Upload successful!');
//       toast.success('File uploaded successfully!');
//     },
//     onUploadError: (err) => {
//       console.log('Error occurred while uploading', err);
//       toast.error(err.message || 'Upload failed');
//     },
//     onUploadBegin: ({ file }) => {
//       console.log('Upload has begun for', file);
//     },
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData(e.currentTarget);
//     const file = formData.get('file');

//     const validatedFields = schema.safeParse({ file });

//     if (!validatedFields.success) {
//       const message = validatedFields.error.flatten().fieldErrors.file?.[0] ?? 'Invalid file';
//       console.log(message);
//       toast.error(message);
//       return;
//     }

//     toast('Processing... Hang tight! Our AI is reading.');

//     const resp = await startUpload([file]);

//     if (!resp) {
//       toast.error('Something went wrong. Please use a different file.');
//       return;
//     }

//     // TODO: Summarize/Parse the uploaded PDF
//   };

//   return (
//     <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
//       <UploadFormInput onSubmit={handleSubmit} />
//     </div>
//   );
// }




// third code 



'use client'


import UploadFormInput from "@/components/upload/upload-form-input";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import { generatePdfSummary, storePdfSummaryAction } from "@/actions/upload-actions";


import z from 'zod';
import { Sumana } from "next/font/google";
import { useRef, useState } from "react";
import { useRouter } from 'next/navigation';

const schema = z.object({
    file:z.instanceof(File,{message:'Invalid file'}).refine((file)=>file.size <= 20 * 1024 * 1024,{
        message:'File size must me less than 20MB',
    })
    .refine((file)=>file.type.startsWith('application/pdf'), 'File must be a PDF'),
});

export default function UploadForm (){

  const formRef = useRef<HTMLFormElement>(null);
  const[isLoading,setIsLoading] = useState(false);
  const router = useRouter();


  const {startUpload, routeConfig} = useUploadThing('pdfUploader',{
       onClientUploadComplete:()=>{
            console.log('upload succesfully!');
        },
        onUploadError:(err) =>{
             console.log('error occured while uploading',err);
             toast("Error occured while uploading!!")

            
        },
        onUploadBegin :(data)=>{
             console.log('upload has begun for',data);
        },
      })  ;


  

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();

    try {
       setIsLoading(true);
      const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;

    // validating the fields
    const validatedFileds = schema.safeParse({file});
    console.log(validatedFileds);

    if(!validatedFileds.success){
        console.log(validatedFileds.error.flatten().fieldErrors.file?.[0] ?? 'Invalid file');
        toast("Something went wrong");

       setIsLoading(false);
        return ;
    }
   toast("Uploading PDF")
    // scehma with zod
    // upload the file to uploadthing

    const uploadResponse =  await startUpload([file]);
    if(!uploadResponse){
      toast("Something went wrong")
      setIsLoading(false);
       return;
    }
    toast("Processing PDF")


    const uploadFileUrl = uploadResponse[0].serverData.fileUrl;

    // parsing the pdf 

    const  result = await generatePdfSummary({
      fileUrl:uploadFileUrl,
      fileName:file.name,
    });
    

    const {data = null, message= null} = result || {};


    if (data){
      let storeResult : any;
      toast('saving pdf')

    
    if(data.summary){
        storeResult =  await storePdfSummaryAction({
        summary: data.summary,
        fileUrl: uploadFileUrl,
        title:data.title,
        fileName:file.name,
       });
       toast('Summary saved')
       
       formRef.current?.reset();

       router.push(`/Summaries/${storeResult.data.id}`);



      
    }
  }
      
    } catch (error) {
      setIsLoading(false);
      console.log(error)
      formRef.current?.reset();
     
      
    } finally{
      setIsLoading(false);
    }

    console.log('submitted');
    
    
    
 };
 return (
  <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
    <UploadFormInput isLoading= {isLoading} ref={formRef} onSubmit={handleSubmit}/>
  </div>

 );
    // parse the pdf 
    // summarize the pdf using ai 
};
    