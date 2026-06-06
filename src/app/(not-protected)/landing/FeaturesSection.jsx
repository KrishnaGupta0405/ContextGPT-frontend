'use client'

import React from 'react'
import { Check } from 'lucide-react'

const FeaturesSection = () => {
  const problems = [
    'Basic AI tools don’t actually know your business facts',
    'Building your own bot is a total pain and always breaks',
    'It takes forever to get new hires up to speed',
    'Your team is stuck doing the same boring tasks over and over'
  ]

const benefits = [
    'Offer instant, reliable 24/7 support without the wait times',
    'Handle most routine tickets automatically and accurately',
    'Double the output of your current support staff',
    'Shift your team’s energy toward high-value growth projects'
  ]

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 px-4 md:px-6 ">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 ">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-2">
            Imagine what you could do if you
          </h2>
          <h2 className="text-4xl md:text-5xl lg:text-6xl= tracking-tight">
            had an <span className="relative inline-block">
              <span className="relative z-10 underline underline-offset-5 decoration-blue-500 decoration-curl">expert chatbot</span>
            </span> answering
          </h2>
          <h2 className="text-4xl md:text-5xl lg:text-6xl  tracking-tight">
            questions 24/7
          </h2>
        </div>

        {/* Before/After Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Before Card */}
          <div className="rounded-2xl bg-white border border-neutral-200 p-8">
            <div className="flex items-center gap-2 mb-6">
              <svg aria-hidden="true" className="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M232,184a8,8,0,0,1-16,0A88,88,0,0,0,67.47,120.16l26.19,26.18A8,8,0,0,1,88,160H24a8,8,0,0,1-8-8V88a8,8,0,0,1,13.66-5.66l26.48,26.48A104,104,0,0,1,232,184Z"></path></svg>
              <span className="text-sm font-semibold text-neutral-600">Before</span>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-black">
              Fickle, one-size-fits-all chatbots that do more harm than good
            </h3>

            <ul className="space-y-3">
              {problems.map((problem, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <span className="w-2 h-2 rounded-full bg-red-400 mt-2.5 flex-shrink-0" />
                  <p className="text-base text-neutral-700 leading-relaxed underline underline-offset-5 decoration-blue-500 decoration-dashed">
                    {problem}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* After Card */}
          <div className="rounded-2xl bg-linear-to-br from-blue-600 to-blue-700 p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm font-semibold text-white">After</span>
              <svg aria-hidden="true" className="h-6 w-6 text-blue-100" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M229.66,109.66l-48,48a8,8,0,0,1-11.32-11.32L212.69,104,170.34,61.66a8,8,0,0,1,11.32-11.32l48,48A8,8,0,0,1,229.66,109.66Zm-48-11.32-48-48A8,8,0,0,0,120,56V96.3A104.15,104.15,0,0,0,24,200a8,8,0,0,0,16,0,88.11,88.11,0,0,1,80-87.63V152a8,8,0,0,0,13.66,5.66l48-48A8,8,0,0,0,181.66,98.34Z"></path></svg>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
              An automated way that super charges your support team
            </h3>

            <ul className="space-y-4">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <p className="text-base text-blue-50 leading-relaxed underline underline-offset-5 decoration-white decoration-dotted">
                    {benefit}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection