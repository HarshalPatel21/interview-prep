import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { Button } from "@/components/ui/button"
import { dummyInterviews } from '@/constants'
import InterviewCard from '@/components/InterviewCard'

export const page = () => {
  return (
    <>
      <section className="card-cta">
        <div className="flex felx-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice on real interview questions & get iinstant feedback
          </p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>

        </div>
        <Image src="/robot.png" alt="robot-dude" width={400} height={400} className='max-sm:hidden'></Image>
      </section>
      <section className='flex flex-col gat-6 mt-8'>
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {dummyInterviews.map((interview)=> (
              <InterviewCard {...interview} key={interview.id}/>
          ))} 
          {/*<p>You haven&apos;t taken any interviews yet</p>*/}
        </div>
      </section>
      <section className="flex felx-col gap-6 mt-8">
        <h2>Take an Interview</h2>
        <div className='interview-section'>
        {dummyInterviews.map((interview)=> (
              <InterviewCard {...interview} key={interview.id}/>
          ))} 
          <p>There are no interviews available</p>
        </div>
      </section>
    </>
  )

}

export default page;
