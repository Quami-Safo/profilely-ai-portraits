import { Sparkles, ExternalLink, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PortfolioPreview = ({ profile, projects }: any) => {
  return (
    <div className="bg-background rounded-xl border shadow-2xl overflow-hidden animate-scale-in">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-accent/20">
        <div className="container mx-auto px-4 text-center">
          {profile?.profile_photo_url && (
            <img
              src={profile.profile_photo_url}
              alt={profile.full_name}
              className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-primary shadow-2xl object-cover"
            />
          )}
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-[hsl(247,83%,65%)] to-accent bg-clip-text text-transparent">
            {profile?.full_name || "Your Name"}
          </h1>
          
          {profile?.tagline && (
            <p className="text-2xl text-muted-foreground mb-4">
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
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bio Section */}
      {profile?.bio && (
        <section className="py-12 px-4">
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
        <section className="py-12 px-4 bg-muted/30">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Projects</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project: any) => (
                <div
                  key={project.id}
                  className="bg-card rounded-xl overflow-hidden border hover:shadow-xl transition-all"
                >
                  {project.image_url && (
                    <div className="h-40 overflow-hidden">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    
                    {project.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {project.description.substring(0, 100)}...
                      </p>
                    )}
                    
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-6 px-4 border-t">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <span>Built with</span>
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-primary font-semibold">Profilely</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PortfolioPreview;
