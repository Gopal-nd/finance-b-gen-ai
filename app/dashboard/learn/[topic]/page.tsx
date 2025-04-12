"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, BookOpen, CheckCircle, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { marked } from "marked"

interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
}

export default function LearnTopicPage() {
  const { topic } = useParams()
  const router = useRouter()
  const [content, setContent] = useState("")
  const [videos, setVideos] = useState<{ title: string; videoId: string }[]>([])
  const [quiz, setQuiz] = useState<QuizQuestion[]>([])
  const [activeTab, setActiveTab] = useState("learn")
  const [loading, setLoading] = useState(true)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  // Format the topic for display
  const formattedTopic =
    typeof topic === "string"
      ? topic
          .replace(/-/g, " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : ""

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch explanation
        const res = await fetch("/api/learn", {
          method: "POST",
          body: JSON.stringify({
            topic: formattedTopic,
            type: "explanation",
          }),
        })
        const data = await res.json()
        setContent(data.response)

        // Fetch videos
        const videoRes = await fetch("/api/learn", {
          method: "POST",
          body: JSON.stringify({
            topic: formattedTopic,
            type: "videos",
          }),
        })
        const videoData = await videoRes.json()
        setVideos(videoData.videos)

        // Fetch quiz questions
        const quizRes = await fetch("/api/learn", {
          method: "POST",
          body: JSON.stringify({
            topic: formattedTopic,
            type: "quiz",
          }),
        })
        const quizData = await quizRes.json()
        setQuiz(quizData.quiz)

        // Initialize quiz answers array
        setQuizAnswers(new Array(quizData.quiz.length).fill(-1))
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (topic) {
      fetchData()
    }
  }, [topic, formattedTopic])

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers]
    newAnswers[questionIndex] = answerIndex
    setQuizAnswers(newAnswers)
  }

  const handleQuizSubmit = () => {
    let correctAnswers = 0
    quiz.forEach((question, index) => {
      if (quizAnswers[index] === question.correctAnswer) {
        correctAnswers++
      }
    })
    setScore(correctAnswers)
    setQuizSubmitted(true)

    // Save completion to local storage
    if (typeof window !== "undefined") {
      const completedTopics = JSON.parse(localStorage.getItem("completedTopics") || "[]")
      if (!completedTopics.includes(topic)) {
        completedTopics.push(topic)
        localStorage.setItem("completedTopics", JSON.stringify(completedTopics))
      }
    }
  }

  const isQuizComplete = quizAnswers.every((answer) => answer !== -1)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => router.push("/dashboard/learn")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Topics
        </Button>

        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">{formattedTopic}</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="learn" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Learn
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Youtube className="h-4 w-4" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Quiz
            </TabsTrigger>
          </TabsList>

          <TabsContent value="learn" className="mt-6">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-4/5" />
              </div>
            ) : (
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap">
                    <div 
                                   dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
                        ></div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="videos" className="mt-6">
            {loading ? (
              <div className="space-y-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : videos.length > 0 ? (
              <div className="grid gap-6">
                {videos.map((video, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{video.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`${video}`}
                          title={video.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No videos available for this topic.</p>
            )}
          </TabsContent>

          <TabsContent value="quiz" className="mt-6">
            {loading ? (
              <div className="space-y-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : quiz.length > 0 ? (
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Test Your Knowledge</CardTitle>
                    <CardDescription>
                      Answer these 5 questions to check your understanding of {formattedTopic}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {quizSubmitted ? (
                      <div className="space-y-6">
                        <div className="text-center">
                          <h3 className="text-2xl font-bold mb-2">
                            Your Score: {score}/{quiz.length}
                          </h3>
                          <Progress value={(score / quiz.length) * 100} className="h-2 mb-2" />
                          <p className="text-muted-foreground">
                            {score === quiz.length
                              ? "Perfect! You've mastered this topic."
                              : score >= quiz.length / 2
                                ? "Good job! You understand the basics but might want to review some concepts."
                                : "Keep learning! Review the material and try again."}
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            setQuizSubmitted(false)
                            setQuizAnswers(new Array(quiz.length).fill(-1))
                          }}
                          className="w-full"
                        >
                          Retake Quiz
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {quiz.map((question, qIndex) => (
                          <div key={qIndex} className="space-y-4">
                            <h3 className="font-medium">
                              Question {qIndex + 1}: {question.question}
                            </h3>
                            <RadioGroup
                              value={quizAnswers[qIndex].toString()}
                              onValueChange={(value:any) => handleAnswerSelect(qIndex, Number.parseInt(value))}
                            >
                              {question.options.map((option, oIndex) => (
                                <div key={oIndex} className="flex items-center space-x-2">
                                  <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}-o${oIndex}`} />
                                  <Label htmlFor={`q${qIndex}-o${oIndex}`}>{option}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        ))}
                        <Button onClick={handleQuizSubmit} disabled={!isQuizComplete} className="w-full mt-6">
                          Submit Answers
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <p className="text-muted-foreground">No quiz available for this topic.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
