'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function Unsubscribe() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('https://2words-backend.vercel.app/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: email }),
      })

      if (response.ok) {
        setStatus('success')
        setMessage('You have been successfully unsubscribed.')
      } else {
        setStatus('error')
        setMessage('An error occurred. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('An error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-4xl font-extrabold mb-8 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-black">
          </span>
        </div>

        <div className="bg-white rounded-xl p-8 w-full space-y-6 shadow-lg border border-gray-200">
          <h1 className="text-2xl font-bold text-center">We're sad to see you go! 😔</h1>
          <p className="text-center text-gray-600">
            Enter your email address below to unsubscribe from 2words.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white placeholder-gray-400 text-black border-gray-300"
              required
            />
            <Button 
              type="submit" 
              className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 transform hover:scale-105"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Processing...' : 'Unsubscribe'}
            </Button>
          </form>
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center text-green-600"
            >
              <CheckCircle className="mr-2" />
              <p>{message}</p>
            </motion.div>
          )}
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center text-red-600"
            >
              <AlertCircle className="mr-2" />
              <p>{message}</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}