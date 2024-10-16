'use client'

import { useState, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion, useInView, AnimatePresence } from "framer-motion"
import ReactConfetti from 'react-confetti'
import { X, ChevronDown } from 'lucide-react'

export default function Component() {
  const [email, setEmail] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [loading, setLoading] = useState(false) // For button loading state
  const [message, setMessage] = useState('') // For response message
  const wordsRef = useRef(null)
  const isInView = useInView(wordsRef, { once: true, amount: 0.2 })

  // Email validation function
  const isValidEmail = (email: string) => {
    // Simple regex to validate a typical email format with .com or similar domains
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    return emailRegex.test(email);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidEmail(email)) {
      setMessage("Please enter a valid email address!")
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://2words-backend.vercel.app/receive-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: email }),
      });

      const data = await response.json();
      setMessage(data.message || "Success!");

      setShowConfetti(true);
      setShowPopup(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (error) {
      setMessage("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      {showConfetti && <ReactConfetti recycle={false} />}
      
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-6xl font-extrabold mb-8 text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-black">
              2Words
            </span>
          </div>

          <div className="bg-white rounded-xl p-8 w-full space-y-6 shadow-lg border border-gray-200">
            <h1 className="text-3xl font-bold text-center">Level Up Your Vocab Game!</h1>
            <p className="text-xl text-center">
              Get 2 new words delivered to your inbox daily 💪🧠
            </p>
            <p className="text-sm text-center text-gray-600">
              No spam, no promos. Just pure vocabulary gains. Unsubscribe anytime.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Drop your email here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white placeholder-gray-400 text-black border-gray-300"
              />
              <Button
                type="submit"
                className={`w-full bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 transform hover:scale-105 ${
                  !isValidEmail(email) || loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!isValidEmail(email) || loading}
              >
                {loading ? 'Sending...' : "Let's Go! 🚀"}
              </Button>
            </form>
            {message && <p className="text-red-500 text-center mt-2">{message}</p>}
          </div>

          <motion.div 
            className="mt-8 text-center text-gray-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <p>Scroll down for today&apos;s words</p>
            <ChevronDown className="mx-auto mt-2 animate-bounce" />
          </motion.div>
        </div>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div 
          ref={wordsRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl p-8 max-w-md w-full shadow-lg border border-gray-200"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Daily words ✨</h2>
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-xl font-bold">Ephemeral</h3>
              <p className="text-sm">Lasting for a very short time.</p>
              <p className="text-sm italic mt-2">
                &quot;The viral TikTok trend was ephemeral, disappearing as quickly as it had emerged.&quot;
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-xl font-bold">Serendipity</h3>
              <p className="text-sm">The occurrence of events by chance in a happy or beneficial way.</p>
              <p className="text-sm italic mt-2">
                &quot;It was pure serendipity that we both swiped right and found our perfect match!&quot;
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          >
            <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-lg relative">
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-center">You&apos;re Awesome! 🎉</h2>
              <p className="text-center">
                An email 📧 will be sent to you at 8 AM ⏰ IST everyday!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
