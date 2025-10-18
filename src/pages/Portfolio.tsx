import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, ExternalLink, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Portfolio = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    loadPortfolio();
  }, [username]);

  const loadPortfolio = async () => {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .eq("portfolio_published", true)
      .single();

    if (profileError || !profileData) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setProfile(profileData);

    const { data: projectsData } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", profileData.id)
      .order("display_order");

    if (projectsData) {
      setProjects(projectsData);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (notFound) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-accent/20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center animate-fade-in-up">
          {profile?.profile_photo_url && (
            <img
              src={profile.profile_photo_url}
              alt={profile.full_name}
              className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-primary shadow-2xl object-cover"
            />
          )}
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-[hsl(247,83%,65%)] to-accent bg-clip-text text-transparent">
            {profile?.full_name}
          </h1>
          
          {profile?.tagline && (
            <p className="text-2xl md:text-3xl text-muted-foreground mb-4">
              {profile.tagline}
            </p>
          )}
          
          {profile?.profession && (
            <p className="text-xl text-primary font-semibold mb-6">
              {profile.profession}
            </p>
          )}
          
          {profile?.skills && profile.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
              {profile.skills.map((skill: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bio Section */}
      {profile?.bio && (
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-6">About Me</h2>
            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {profile.bio}
            </p>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Featured Projects</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-2xl transition-all duration-300 animate-fade-in cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  {project.image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    
                    {project.description && (
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {project.description}
                      </p>
                    )}
                    
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.slice(0, 3).map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {project.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <span>Built with</span>
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-primary font-semibold">Profilely</span>
          </div>
        </div>
      </footer>

      {/* Project Details Modal */}
      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl">{selectedProject?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedProject && (
            <div className="space-y-6">
              {selectedProject.image_url && (
                <div className="relative h-64 md:h-96 overflow-hidden rounded-lg">
                  <img
                    src={selectedProject.image_url}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {selectedProject.description && (
                <div>
                  <h4 className="font-semibold text-lg mb-2">About</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>
              )}
              
              {selectedProject.tags && selectedProject.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold text-lg mb-3">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                {selectedProject.project_url && (
                  <Button asChild variant="default">
                    <a
                      href={selectedProject.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  </Button>
                )}
                
                {selectedProject.github_url && (
                  <Button asChild variant="outline">
                    <a
                      href={selectedProject.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Github className="w-4 h-4" />
                      View Code
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Portfolio;
