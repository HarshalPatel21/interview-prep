import { getFeedbackByInterviewId, getInterviewById } from '@/lib/actions/general.action';
import { redirect } from 'next/navigation';
import React from 'react'
import Image from "next/image";
import { getRandomInterviewCover } from '@/lib/utils';
import DisplayTechicons from '@/components/DisplayTechicons';
import Agent from '@/components/Agent';
import { getCurrentUser } from '@/lib/actions/auth.action';
// import WebcamRecorder from '@/components/WebCamRecorder';
import dynamic from "next/dynamic";
import WebcamStreamer from '@/components/WebcamStreamer';

// const WebcamRecorder = dynamic(() => import("@/components/WebCamRecorder"), { ssr: false });

const page = async ({params}:RouteParams) => {
  const {id}=await params;
  const user = await getCurrentUser()
  const interview = await getInterviewById(id);

  if(!interview) redirect('/')

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  return (
    <>
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image
              src={getRandomInterviewCover()}
              alt='="cover-image'
              width={40}
              height={40}
              className="rounded-full object-cover size-[40px]"
            />
            <h3 className="capitalize">{interview.role} Interview</h3>
          </div>
          <DisplayTechicons techStack={interview.techstack} />
        </div>
        <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit capitalize">
          {interview.type}
        </p>
      </div>
      <Agent
        userName={user?.name || ""}
        userId={user?.id}
        interviewId={id}
        type="interview"
        questions={interview.questions}
        feedbackId={feedback?.id}
        technical={interview.type === "technical"}
      />
      {/* <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Interview Recording</h2>
        <WebcamStreamer/>
      </div> */}
    </>
  );
}

export default page