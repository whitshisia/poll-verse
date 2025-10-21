import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2, Save } from "lucide-react";

type QuestionType = "multiple_choice" | "text" | "ranking" | "scale";

interface Question {
  id: string;
  question_text: string;
  question_type: QuestionType;
  options: string[];
}

const CreatePoll = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [anonymousVoting, setAnonymousVoting] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([
    { id: "1", question_text: "", question_type: "multiple_choice", options: ["", ""] },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now().toString(),
        question_text: "",
        question_type: "multiple_choice",
        options: ["", ""],
      },
    ]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const addOption = (questionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) => (idx === optionIndex ? value : opt)),
            }
          : q
      )
    );
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.filter((_, idx) => idx !== optionIndex) }
          : q
      )
    );
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter a poll title");
      return;
    }

    if (questions.some((q) => !q.question_text.trim())) {
      toast.error("Please fill in all question texts");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to create a poll");
        navigate("/auth");
        return;
      }

      const { data: poll, error: pollError } = await supabase
        .from("polls")
        .insert({
          creator_id: user.id,
          title,
          description,
          anonymous_voting: anonymousVoting,
        })
        .select()
        .single();

      if (pollError) throw pollError;

      const questionsData = questions.map((q, index) => ({
        poll_id: poll.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.question_type === "multiple_choice" ? q.options.filter((opt) => opt.trim()) : null,
        order_index: index,
      }));

      const { error: questionsError } = await supabase
        .from("questions")
        .insert(questionsData);

      if (questionsError) throw questionsError;

      toast.success("Poll created successfully!");
      navigate(`/poll/${poll.id}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gradient-gold mb-2">Create New Poll</h1>
          <p className="text-muted-foreground">Design your poll and add questions</p>
        </div>

        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Poll Details</CardTitle>
              <CardDescription>Basic information about your poll</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Poll Title *</Label>
                <Input
                  id="title"
                  placeholder="What's your poll about?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add more context to your poll"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Anonymous Voting</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow voters to respond anonymously
                  </p>
                </div>
                <Switch
                  checked={anonymousVoting}
                  onCheckedChange={setAnonymousVoting}
                />
              </div>
            </CardContent>
          </Card>

          {questions.map((question, qIndex) => (
            <Card key={question.id} className="glass-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">Question {qIndex + 1}</CardTitle>
                  </div>
                  {questions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestion(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Question Text *</Label>
                  <Input
                    placeholder="Enter your question"
                    value={question.question_text}
                    onChange={(e) =>
                      updateQuestion(question.id, "question_text", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Question Type</Label>
                  <Select
                    value={question.question_type}
                    onValueChange={(value) =>
                      updateQuestion(question.id, "question_type", value as QuestionType)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                      <SelectItem value="text">Open Text</SelectItem>
                      <SelectItem value="ranking">Ranking</SelectItem>
                      <SelectItem value="scale">Scale (1-10)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {question.question_type === "multiple_choice" && (
                  <div className="space-y-2">
                    <Label>Options</Label>
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex gap-2">
                        <Input
                          placeholder={`Option ${optIndex + 1}`}
                          value={option}
                          onChange={(e) =>
                            updateOption(question.id, optIndex, e.target.value)
                          }
                        />
                        {question.options.length > 2 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeOption(question.id, optIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addOption(question.id)}
                    >
                      <Plus className="h-4 w-4" />
                      Add Option
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          <div className="flex gap-4">
            <Button variant="outline" onClick={addQuestion} className="flex-1">
              <Plus className="h-4 w-4" />
              Add Question
            </Button>
            <Button variant="hero" onClick={handleSubmit} disabled={loading} className="flex-1">
              <Save className="h-4 w-4" />
              {loading ? "Creating..." : "Create Poll"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;
