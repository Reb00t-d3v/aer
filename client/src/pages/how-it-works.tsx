import { useState } from "react";
import { HOW_IT_WORKS_STEPS } from "@/lib/constants";
import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  return (
    <>
      <div className="bg-white dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              How RemoveBG Works
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-500 dark:text-gray-400 mx-auto">
              Our powerful AI technology makes background removal simple, fast, and accurate
            </p>
          </div>
          
          <div className="mt-16">
            <div className="lg:grid lg:grid-cols-3 lg:gap-16">
              {HOW_IT_WORKS_STEPS.map((step) => (
                <div key={step.id} className="mt-10 lg:mt-0">
                  <div className="flex items-center justify-center h-16 w-16 rounded-md bg-primary bg-opacity-10 text-primary mx-auto">
                    {step.icon === "upload" && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    )}
                    {step.icon === "process" && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    )}
                    {step.icon === "download" && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    )}
                  </div>
                  <div className="mt-5 text-center">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                      {step.id}. {step.title}
                    </h3>
                    <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-20">
            <div className="bg-gray-50 dark:bg-gray-800 overflow-hidden rounded-lg shadow">
              <div className="px-4 py-5 sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                  <div className="md:col-span-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                      Our Technology
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Learn more about the advanced AI behind our background removal tool
                    </p>
                  </div>
                  <div className="mt-5 md:mt-0 md:col-span-2">
                    <div className="space-y-4">
                      <div className="border-l-4 border-primary pl-4 py-2">
                        <h4 className="text-base font-medium text-gray-900 dark:text-white">
                          Deep Learning AI
                        </h4>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Our tool uses advanced neural networks trained on millions of images to accurately identify the main subject in any image.
                        </p>
                      </div>
                      <div className="border-l-4 border-primary pl-4 py-2">
                        <h4 className="text-base font-medium text-gray-900 dark:text-white">
                          Edge Detection
                        </h4>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Precise edge detection algorithms ensure clean, crisp outlines even for complex subjects like hair and fur.
                        </p>
                      </div>
                      <div className="border-l-4 border-primary pl-4 py-2">
                        <h4 className="text-base font-medium text-gray-900 dark:text-white">
                          Continuous Improvement
                        </h4>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Our models are constantly trained with new data to improve accuracy and handle more complex images.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-20">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Tips for Best Results
              </h2>
              <p className="mt-4 max-w-2xl text-gray-500 dark:text-gray-400 mx-auto">
                Follow these recommendations to get the cleanest background removal
              </p>
            </div>
            
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary bg-opacity-10 text-primary mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Good Lighting
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Ensure your subject is well-lit with good contrast from the background. Avoid harsh shadows that blend with the subject.
                  </p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary bg-opacity-10 text-primary mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    High Resolution
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Use the highest resolution images possible. Higher quality images provide more detail for our AI to work with.
                  </p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary bg-opacity-10 text-primary mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Clear Subject
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Ensure your main subject is clearly visible and distinct from the background for the best results.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-20 bg-primary rounded-lg shadow-lg overflow-hidden">
            <div className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20 text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                Ready to try it yourself?
              </h2>
              <p className="mt-4 text-lg leading-6 text-purple-100">
                Remove your first background for free in seconds!
              </p>
              <div className="mt-8 flex justify-center">
                <div className="inline-flex rounded-md shadow">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="text-sm sm:text-base"
                    onClick={() => window.location.href = "/#upload-section"}
                  >
                    Try now for free
                  </Button>
                </div>
                <div className="ml-3 inline-flex">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-white border-white hover:bg-white hover:text-primary text-sm sm:text-base"
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    Sign up
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialView="signup"
      />
    </>
  );
}
