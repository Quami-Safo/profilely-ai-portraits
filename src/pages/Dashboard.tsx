import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, LogOut, Eye, Save } from "lucide-react";
import ProfileForm from "@/components/dashboard/ProfileForm";
import ProjectsSection from "@/components/dashboard/ProjectsSection";
import PortfolioPreview from "@/components/dashboard/PortfolioPreview";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);
    await loadProfile(session.user.id);
    await loadProjects(session.user.id);
    setLoading(false);
  };

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (!error && data) {
      setProfile(data);
    }
  };

  const loadProjects = async (userId: string) => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("display_order");

    if (!error && data) {
      setProjects(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handlePublish = async () => {
    if (!profile?.username) {
      toast({
        variant: "destructive",
        title: "Missing Username",
        description: "Please set a username before publishing",
      });
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ portfolio_published: true })
      .eq("id", user.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to publish portfolio",
      });
      return;
    }

    toast({
      title: "Portfolio Published!",
      description: `View at /u/${profile.username}`,
    });
    
    setProfile({ ...profile, portfolio_published: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Profilely
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? "Edit" : "Preview"}
            </Button>
            
            {profile?.username && (
              <Button
                variant="outline"
                onClick={() => navigate(`/u/${profile.username}`)}
              >
                View Public
              </Button>
            )}
            
            <Button onClick={handlePublish} disabled={profile?.portfolio_published}>
              <Save className="w-4 h-4 mr-2" />
              {profile?.portfolio_published ? "Published" : "Publish"}
            </Button>
            
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {showPreview ? (
          <PortfolioPreview profile={profile} projects={projects} />
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <ProfileForm
                profile={profile}
                userId={user.id}
                onUpdate={setProfile}
              />
            </div>
            
            <div>
              <ProjectsSection
                projects={projects}
                userId={user.id}
                onUpdate={setProjects}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
