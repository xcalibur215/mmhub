import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-real-estate.jpg";

/**
 * Lightweight public-facing landing hero shown at root path.
 * Distinct from Index (which has heavier sections + featured listings)
 */
const HomeLanding = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
            alt="Modern rental properties collage"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
            Discover <span className="text-transparent bg-clip-text bg-gradient-hero">Better Rentals</span><br /> Faster & Easier
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
            Search verified listings, connect with trusted landlords & agents, and manage your rental journey—all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" variant="hero" className="h-12 text-base font-semibold">
              <Link to="/auth/register">Sign Up</Link>
            </Button>
            <Button asChild size="lg" variant="premium" className="h-12 text-base font-semibold">
              <Link to="/listings">Get Started</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground/90">
            <div>
              <span className="font-semibold text-primary">10k+</span> Active Listings
            </div>
            <div>
              <span className="font-semibold text-primary">5k+</span> Happy Tenants
            </div>
            <div>
              <span className="font-semibold text-primary">1.2k+</span> Verified Landlords
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeLanding;
