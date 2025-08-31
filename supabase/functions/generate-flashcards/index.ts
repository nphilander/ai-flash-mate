import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { studyNotes } = await req.json()

    if (!studyNotes || studyNotes.length < 50) {
      return new Response(
        JSON.stringify({ error: 'Study notes must be at least 50 characters long' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Use Hugging Face's free inference API for question generation
    const response = await fetch(
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `Generate 5 quiz questions and answers based on this study material: ${studyNotes.substring(0, 1000)}`,
          parameters: {
            max_length: 500,
            temperature: 0.7,
            return_full_text: false
          }
        })
      }
    )

    if (!response.ok) {
      // Fallback: Generate simple questions based on content analysis
      const flashcards = generateFallbackQuestions(studyNotes)
      return new Response(
        JSON.stringify({ flashcards }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const aiResponse = await response.json()
    
    // Parse AI response or use fallback
    let flashcards = parseAIResponse(aiResponse) || generateFallbackQuestions(studyNotes)

    return new Response(
      JSON.stringify({ flashcards }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate flashcards' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function generateFallbackQuestions(studyNotes: string) {
  const sentences = studyNotes.split(/[.!?]+/).filter(s => s.trim().length > 20)
  const flashcards = []

  // Extract key concepts and create questions
  const keyTerms = extractKeyTerms(studyNotes)
  
  for (let i = 0; i < Math.min(5, keyTerms.length); i++) {
    const term = keyTerms[i]
    const contextSentence = sentences.find(s => s.toLowerCase().includes(term.toLowerCase())) || sentences[i % sentences.length]
    
    flashcards.push({
      question: `What is ${term}?`,
      answer: contextSentence.trim() || `${term} is an important concept in this study material.`,
      difficulty: 'medium'
    })
  }

  // If we don't have enough, add some general questions
  while (flashcards.length < 5 && sentences.length > 0) {
    const sentence = sentences[flashcards.length % sentences.length]
    const words = sentence.trim().split(' ')
    if (words.length > 5) {
      const keyWord = words.find(w => w.length > 4) || words[Math.floor(words.length / 2)]
      flashcards.push({
        question: `Explain the concept related to "${keyWord}"`,
        answer: sentence.trim(),
        difficulty: 'medium'
      })
    }
  }

  return flashcards.slice(0, 5)
}

function extractKeyTerms(text: string): string[] {
  // Simple keyword extraction - look for capitalized words, repeated terms, etc.
  const words = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || []
  const wordCount: { [key: string]: number } = {}
  
  words.forEach(word => {
    if (word.length > 3) {
      wordCount[word] = (wordCount[word] || 0) + 1
    }
  })
  
  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word)
}

function parseAIResponse(response: any): any[] | null {
  try {
    // Try to parse structured response from AI
    if (Array.isArray(response) && response.length > 0) {
      const text = response[0].generated_text || response[0].text || JSON.stringify(response[0])
      
      // Look for Q&A patterns in the text
      const qaPattern = /Q:?\s*(.+?)\s*A:?\s*(.+?)(?=Q:|$)/gi
      const matches = [...text.matchAll(qaPattern)]
      
      if (matches.length > 0) {
        return matches.slice(0, 5).map(match => ({
          question: match[1].trim(),
          answer: match[2].trim(),
          difficulty: 'medium'
        }))
      }
    }
    return null
  } catch {
    return null
  }
}