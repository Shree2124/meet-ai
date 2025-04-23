import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

function FeaturedTitle() {
  return (
    <div className="px-4 py-20 md:py-24 w-full">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-6 font-bold text-gray-900 dark:text-white text-3xl md:text-4xl lg:text-5xl">
          Be more productive in work, life and meetings
        </h1>
        <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300 text-base md:text-lg">
          Our meeting summary tool helps you stay organized and efficient, ensuring you never forget important details, tasks or deadlines.
        </p>
      </div>
    </div>
  );
}

export default FeaturedTitle
