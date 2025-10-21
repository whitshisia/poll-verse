import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Share2, Eye, Copy } from "lucide-react";
import { toast } from "sonner";

const PollResults = () => {
  const { pollId } = useParams();
  const [poll, setPoll] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPollData();
    subscribeToVotes();
  }, [pollId]);

  const fetchPollData = async () => {
    const { data: pollData } = await supabase
      .from("polls")
      .select("*")
      .eq("id", pollId)
      .single();

    if (pollData) {
      setPoll(pollData);

      const { data: questionsData } = await supabase
        .from("questions")
        .select("*")
        .eq("poll_id", pollId)
        .order("order_index");

      setQuestions(questionsData || []);

      const { data: votesData } = await supabase
        .from("votes")
        .select("*")
        .eq("poll_id", pollId);

      processResults(questionsData || [], votesData || []);
    }

    setLoading(false);
  };

  const subscribeToVotes = () => {
    const channel = supabase
      .channel(`poll-${pollId}-votes`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "votes",
          filter: `poll_id=eq.${pollId}`,
        },
        () => {
          fetchPollData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const processResults = (questionsData: any[], votesData: any[]) => {
    const resultsMap: Record<string, any> = {};

    questionsData.forEach((question) => {
      const questionVotes = votesData.filter((v) => v.question_id === question.id);
      const totalVotes = questionVotes.length;

      if (question.question_type === "multiple_choice") {
        const optionCounts: Record<string, number> = {};
        question.options?.forEach((opt: string) => {
          optionCounts[opt] = 0;
        });

        questionVotes.forEach((vote) => {
          const answer = vote.answer;
          if (answer in optionCounts) {
            optionCounts[answer]++;
          }
        });

        resultsMap[question.id] = { type: "multiple_choice", optionCounts, totalVotes };
      } else if (question.question_type === "text") {
        resultsMap[question.id] = {
          type: "text",
          responses: questionVotes.map((v) => v.answer),
        };
      } else if (question.question_type === "scale") {
        const values = questionVotes.map((v) => parseInt(v.answer));
        const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
        resultsMap[question.id] = { type: "scale", average: avg.toFixed(1), totalVotes };
      }
    });

    setResults(resultsMap);
  };

  const copyPollLink = () => {
    const url = `${window.location.origin}/poll/${pollId}`;
    navigator.clipboard.writeText(url);
    toast.success("Poll link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading results...</p>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="glass-card max-w-md">
          <CardContent className="flex flex-col items-center py-12">
            <p className="text-lg text-muted-foreground mb-4">Poll not found</p>
            <Link to="/dashboard">
              <Button variant="hero">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalResponses = Object.values(results)[0]?.totalVotes || 0;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="glass-card mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{poll.title}</CardTitle>
                {poll.description && (
                  <CardDescription className="text-base">{poll.description}</CardDescription>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  {totalResponses} {totalResponses === 1 ? "response" : "responses"}
                </p>
              </div>
              <div className="flex gap-2">
                <Link to={`/poll/${pollId}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                    View Poll
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={copyPollLink}>
                  <Copy className="h-4 w-4" />
                  Copy Link
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="space-y-6">
          {questions.map((question, index) => {
            const result = results[question.id];

            return (
              <Card key={question.id} className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {index + 1}. {question.question_text}
                  </CardTitle>
                  <CardDescription>
                    {result?.totalVotes || 0} {result?.totalVotes === 1 ? "response" : "responses"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {result?.type === "multiple_choice" && (
                    <div className="space-y-4">
                      {Object.entries(result.optionCounts).map(([option, count]: [string, any]) => {
                        const percentage =
                          result.totalVotes > 0 ? (count / result.totalVotes) * 100 : 0;
                        return (
                          <div key={option} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{option}</span>
                              <span className="text-primary font-semibold">
                                {count} ({percentage.toFixed(0)}%)
                              </span>
                            </div>
                            <Progress value={percentage} className="h-3" />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {result?.type === "text" && (
                    <div className="space-y-3">
                      {result.responses.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No responses yet</p>
                      ) : (
                        result.responses.map((response: string, idx: number) => (
                          <div
                            key={idx}
                            className="p-3 bg-muted/30 rounded-lg text-sm border border-border/30"
                          >
                            {response}
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {result?.type === "scale" && (
                    <div className="text-center py-6">
                      <div className="text-4xl font-bold text-gradient-gold mb-2">
                        {result.average}
                      </div>
                      <p className="text-sm text-muted-foreground">Average Score (out of 10)</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PollResults;
