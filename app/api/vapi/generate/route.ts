import {generateText} from "ai";
import {google} from "@ai-sdk/google"
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

export async function GET(){
    return Response.json({success: true, data: 'THANK YOU!'}, {status: 200});
}

export async function POST(request: Request){
    const{ type , role , level , techstack , amount , userid } = await request.json();

    try {
        const {text: questions} = await generateText({
            model: google('gemini-2.0-flash-001'),
            prompt: `Prepare questions for a job interview.
The job role is ${role}.
The job experience level is ${level}.
The tech stack used in the job is: ${techstack}.
The focus between behavioural and technical questions should lean towards: ${type}.
The amount of questions required is: ${amount}.

If at any point the user diverts from the domain or purpose of this interview, respond with:
“Let’s not stray from the purpose of this interview—let’s get back on track and continue preparing your questions.”

After delivering that first reminder line, the AI should say:
“Please introduce yourself to the candidate.”

Please return only the interview questions (and that one introduction prompt), without any additional text.
The questions are going to be read by a voice assistant so do not use “/”, “*” or any other special characters which might break the voice flow.
Return everything formatted exactly like this:
["Question 1", "Question 2", "Question 3"]

Thank you! <3
    `,
        });

        const interview = {
            role , type , level , 
            techstack: techstack.split(','),
            questions:JSON.parse(questions),
            userId:userid,
            finalized:true,
            coverImage:getRandomInterviewCover(),
            createdAt:new Date().toISOString()
        }

        await db.collection("interviews").add(interview);

        return Response.json({success: true} , {status: 200})
    } catch (error) {
        console.error(error);

        return Response.json({success:false ,error},{status: 500});
    }
}