import BigGradient from "@/components/common/bg-gradient";
import {  Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import UploadForm from "@/components/upload/upload-form";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { hasReachedUploadLimit } from "@/lib/user";

export default async function Page(){


const user = await currentUser();

if(!user?.id){
    redirect('/sign-in');
}

const userId = user.id;

const { hasReachedUploadLimit: hasReachedLimit } = await hasReachedUploadLimit(userId);

if(hasReachedLimit){
    redirect('/dasboard');
}



    return <section className="min-h-screen">
        <BigGradient/>
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            
            <div className="flex flex-col items-center justify-center gap-6 text-center">
                <div className="relative p-[1px] overflow-hidden rounded-full bg-linear-to-r from-rose-200 via-rose-500 to-rose-800 animate-gradient-x group">
                <Badge variant={'secondary'} className="relative px-6 py-2 text-base font-medium bg-white rounded-full group-hover:bg-gray-50 transition-colors"><Sparkles className="h-6 w-6 mr-2 text-rose-600 animate-pulse"/>
                <p className="text-base">AI-Powered Content Creation</p>
                </Badge>
                </div>
                <h1>Start Uploading Your PDF's</h1>
                <p>start upload  your pdf and let AI do the magic!</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-6 text-center">
            <UploadForm/>
            </div>
             
        </div>
        

        
    </section>
}