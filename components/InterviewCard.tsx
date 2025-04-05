import React from 'react'
import dayjs from 'dayjs';
import Image from 'next/image';
import { getRandomInterviewCover } from '@/lib/utils';
import { Button } from './ui/button';
import Link from 'next/link';
import DisplayTechIcons from './DisplayTechIcons';
import { getFeedbackByInterviewId } from '@/lib/actions/general.action';

const InterviewCard = async ({ id , userId , role , type , techstack , createdAt }:InterviewCardProps) => {
    const feedback = userId && id 
    ? await getFeedbackByInterviewId({interviewId:id , userId}) : null;
    const normalizedType = /mix/gi.test(type) ? 'Mixed' :type; 
    const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format('MMM D , YYYY');

  return (
    <div className='card-border w-[360px] max-sm:w-full min-h-96 bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300'>
      <div className='card-interview p-6 flex flex-col h-full justify-between'>
            <div>
                <div className='absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600 backdrop-blur-sm'>
                    <p className='badge-text font-medium'>{normalizedType}</p>
                </div>
                
                <div className='flex flex-col items-center'>
                    <Image 
                        src={getRandomInterviewCover()} 
                        alt='cover image' 
                        width={96} 
                        height={96} 
                        className='rounded-full object-cover border-4 border-light-200 shadow-sm size-[96px]'
                    />
                    <h3 className='mt-5 capitalize text-xl font-semibold text-center'>
                        {role} Interview
                    </h3>
                </div>
                
                <div className='flex justify-center gap-5 mt-4'>
                    <div className='flex items-center gap-2 text-gray-600'>
                        <Image src="/calendar.svg" alt='calendar' width={18} height={18} className='opacity-70'/>
                        <p className='text-sm'>{formattedDate}</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Image src='/star.svg' alt='star' width={18} height={18} className='opacity-80'/>
                        <p className='text-sm font-medium'>{feedback?.totalScore || '---'}/100</p>
                    </div>
                </div>
                
                <p className='line-clamp-2 mt-5 text-gray-700 text-center px-2'>
                    {feedback?.finalAssessment || "You haven't taken the interview yet. Take it now to improve your skills."}
                </p>
            </div>
            
            <div className='flex justify-between items-center mt-8'>
                <DisplayTechIcons techstack={techstack} />

                <Button className='btn-primary px-6 py-3 rounded-lg hover:scale-105 transition-transform'>
                    <Link 
                        href={feedback ? `/interview/${id}/feedback` : `/interview/${id}`}
                        className='font-medium'
                    >
                        {feedback ? 'Check Feedback' : 'Start Interview'}
                    </Link>
                </Button>
            </div>
      </div>
    </div>
)
}

export default InterviewCard
