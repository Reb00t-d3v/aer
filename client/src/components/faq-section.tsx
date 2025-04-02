import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How accurate is the background removal?",
    answer: "Our AI-powered background removal uses advanced machine learning algorithms to detect and remove backgrounds with remarkable accuracy. It works exceptionally well with various subjects, including people, products, and even complex elements like hair and fur. For best results, use images with good lighting and clear contrast between the subject and background."
  },
  {
    question: "What image formats are supported?",
    answer: "We support the most common image formats including JPG, PNG, and WEBP. The maximum file size is 5MB for free users and 15MB for premium users. For best results, we recommend using high-resolution images with clear subjects."
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Yes, you can cancel your subscription at any time from your account settings. After cancellation, your premium features will remain active until the end of your current billing cycle. We don't offer refunds for partial subscription periods."
  },
  {
    question: "Is my data secure?",
    answer: "We take data security seriously. All image uploads are encrypted using SSL/TLS protocols. We temporarily store your images for processing and delete them after 24 hours for free users. Premium users can access their image history for longer periods based on their subscription plan. We never share your images with third parties."
  }
];

export default function FAQSection() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  
  const toggleFaq = (index: number) => {
    setOpenFaqIndex(prev => prev === index ? -1 : index);
  };
  
  return (
    <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find answers to common questions about our service.
          </p>
        </div>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
              <button 
                className="w-full text-left px-6 py-4 focus:outline-none flex items-center justify-between font-medium"
                onClick={() => toggleFaq(index)}
              >
                <span>{faq.question}</span>
                {openFaqIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-primary transition-transform duration-200" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-primary transition-transform duration-200" />
                )}
              </button>
              
              <div className={`px-6 pb-4 ${openFaqIndex === index ? '' : 'hidden'}`}>
                <p className="text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
