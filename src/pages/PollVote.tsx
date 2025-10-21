import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { BarChart3, CheckCircle } from "lucide-react";

const PollVote = () => {
  const { pollId } = useParams();
  const [poll, setPoll] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchPoll();
  }, [pollId]);

  const fetchPoll = async () => {
    const { data: pollData } = await supabase
      .from("polls")
      .select("*")
      .eq("id", pollId)
      .single();

    if (pollData && pollData.is_active) {
      setPoll(pollData);

      const { data: questionsData } = await supabase
        .from("questions")
        .select("*")
        .eq("poll_id", pollId)
        .order("order_index");

      setQuestions(questionsData || []);
    }

    setLoading(false);
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      toast.error("Please answer all questions");
      return;
    }

    setSubmitting(true);

    try {
      const votesData = questions.map((q) => ({
        poll_id: pollId,
        question_id: q.id,
        answer: answers[q.id],
        voter_identifier: crypto.randomUUID(),
      }));

      const { error } = await supabase.from("votes").insert(votesData);

      if (error) throw error;

      toast.success("Your response has been submitted!");
      setSubmitted(true);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading poll...</p>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="glass-card max-w-md">
          <CardContent className="flex flex-col items-center py-12">
            <p className="text-lg text-muted-foreground mb-4">Poll not found or inactive</p>
            <Link to="/">
              <Button variant="hero">Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="glass-card max-w-md">
          <CardContent className="flex flex-col items-center py-12">
            <CheckCircle className="h-16 w-16 text-primary mb-4" />
            <h2 className="text-2xl font-bold text-gradient-gold mb-2">Thank You!</h2>
            <p className="text-muted-foreground text-center mb-6">
              Your response has been recorded successfully.
            </p>
            <Link to={`/poll/${pollId}/results`}>
              <Button variant="hero">View Results</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto max-w-3xl py-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <BarChart3 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gradient-gold">Pollverse</span>
          </Link>
        </div>

        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle className="text-3xl">{poll.title}</CardTitle>
            {poll.description && (
              <CardDescription className="text-base">{poll.description}</CardDescription>
            )}
          </CardHeader>
        </Card>

        <div className="space-y-6">
          {questions.map((question, index) => (
            <Card key={question.id} className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">
                  {index + 1}. {question.question_text}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {question.question_type === "multiple_choice" && (
                  <RadioGroup
                    value={answers[question.id]}
                    onValueChange={(value) =>
                      setAnswers({ ...answers, [question.id]: value })
                    }
                  >
                    <div className="space-y-3">
                      {question.options?.map((option: string, optIndex: number) => (
                        <div key={optIndex} className="flex items-center space-x-3">
                          <RadioGroupItem value={option} id={`${question.id}-${optIndex}`} />
                          <Label
                            htmlFor={`${question.id}-${optIndex}`}
                            className="cursor-pointer flex-1 py-2"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}

                {question.question_type === "text" && (
                  <Textarea
                    placeholder="Your answer..."
                    value={answers[question.id] || ""}
                    onChange={(e) =>
                      setAnswers({ ...answers, [question.id]: e.target.value })
                    }
                    rows={4}
                  />
                )}

                {question.question_type === "scale" && (
                  <div className="space-y-4">
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      placeholder="Enter a number from 1 to 10"
                      value={answers[question.id] || ""}
                      onChange={(e) =>
                        setAnswers({ ...answers, [question.id]: parseInt(e.target.value) })
                      }
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>1 (Low)</span>
                      <span>10 (High)</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          <Button
            variant="hero"
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Response"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PollVote;
