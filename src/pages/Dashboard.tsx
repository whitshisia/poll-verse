import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/integrations/firebase/config";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BarChart3, Users, TrendingUp, LogOut } from "lucide-react";

interface Poll {
  id: string;
  title: string;
  description?: string;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/auth");
      else {
        setUserId(user.uid);
        fetchPolls(user.uid);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchPolls = async (uid: string) => {
    setLoading(true);
    const q = query(
      collection(db, "polls"),
      where("creator_id", "==", uid),
      orderBy("created_at", "desc")
    );
    const querySnapshot = await getDocs(q);
    const fetched = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Poll, "id">),
    }));
    setPolls(fetched);
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/auth");
  };

  const handleCreatePoll = () => {
    navigate("/create-poll");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <div className="flex gap-3">
            <Button onClick={handleCreatePoll}>
              <Plus className="w-4 h-4 mr-2" />
              Create Poll
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading your polls...</p>
        ) : polls.length === 0 ? (
          <p className="text-muted-foreground">
            You haven’t created any polls yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((poll) => (
              <Card key={poll.id} className="glass-card hover:shadow-lg transition">
                <CardHeader>
                  <CardTitle className="text-lg">{poll.title}</CardTitle>
                  <CardDescription>
                    {poll.description || "No description"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>{new Date(poll.created_at).toLocaleDateString()}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/results/${poll.id}`)}
                    >
                      <BarChart3 className="w-4 h-4 mr-1" />
                      View Results
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
