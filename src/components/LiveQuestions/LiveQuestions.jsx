"use client"

import { useEffect, useState } from "react"

export default function LiveQuestions({ sessionId }) {
  const [questions, setQuestions] = useState([])
  const [content, setContent] = useState("")
  const [authorName, setAuthorName] = useState("")

  async function loadQuestions() {
    const response = await fetch(
      `http://localhost:3000/api/sessions/${sessionId}/questions`
    )

    const data = await response.json()

    setQuestions(data)
  }

  useEffect(() => {
    loadQuestions()

    const interval = setInterval(loadQuestions, 3000)

    return () => clearInterval(interval)
  }, [])

  async function submitQuestion(e) {
    e.preventDefault()

    await fetch(
      `http://localhost:3000/api/sessions/${sessionId}/questions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          authorName,
        }),
      }
    )

    setContent("")

    loadQuestions()
  }

  async function upvote(questionId) {
    const visitorId = localStorage.getItem("visitorId")

    await fetch(
      `http://localhost:3000/api/questions/${questionId}/upvote`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visitorId,
        }),
      }
    )

    loadQuestions()
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-white mb-6">
        Questions live
      </h2>

      <form
        onSubmit={submitQuestion}
        className="space-y-4 mb-8"
      >
        <input
          type="text"
          placeholder="Votre nom"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="w-full p-3 rounded bg-slate-800 text-white"
        />

        <textarea
          placeholder="Posez votre question..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 rounded bg-slate-800 text-white"
        />

        <button
          type="submit"
          className="bg-cyan-400 text-black px-6 py-3 rounded font-bold"
        >
          Envoyer
        </button>
      </form>

      <div className="space-y-4">
        {questions.map((q) => (
          <div
            key={q.id}
            className="bg-slate-800 p-4 rounded-xl"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white font-semibold">
                  {q.authorName || "Anonyme"}
                </p>

                <p className="text-slate-300">
                  {q.content}
                </p>
              </div>

              <button
                onClick={() => upvote(q.id)}
                className="bg-cyan-400 px-4 py-2 rounded text-black font-bold"
              >
                ▲ {q.upvotes}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}