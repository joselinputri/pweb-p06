import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, ShoppingCart, FileText, ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      navigate('/books');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="gradient-hero absolute inset-0 opacity-10" />
        <div className="container relative mx-auto px-4 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-tight text-foreground md:text-6xl">
              Welcome to
              <br />
              <span className="text-primary">IT Literature Shop</span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Your online catalog for the finest IT and computer science literature
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" onClick={() => navigate('/auth/login')} className="text-lg">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/auth/register')} className="text-lg">
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
            Everything You Need
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-card p-8 text-center shadow-elegant transition-smooth hover:-translate-y-2 hover:shadow-lg">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Browse Books</h3>
              <p className="text-muted-foreground">
                Explore our vast collection of IT literature with advanced search and filters
              </p>
            </div>

            <div className="rounded-xl bg-card p-8 text-center shadow-elegant transition-smooth hover:-translate-y-2 hover:shadow-lg">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                  <ShoppingCart className="h-8 w-8 text-accent" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Easy Shopping</h3>
              <p className="text-muted-foreground">
                Add books to your cart and checkout with our streamlined purchase process
              </p>
            </div>

            <div className="rounded-xl bg-card p-8 text-center shadow-elegant transition-smooth hover:-translate-y-2 hover:shadow-lg">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Track Orders</h3>
              <p className="text-muted-foreground">
                View your transaction history and keep track of all your purchases
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="gradient-hero mx-auto max-w-4xl rounded-2xl p-12 text-center text-white shadow-lg">
            <h2 className="mb-4 text-3xl font-bold">Ready to Start?</h2>
            <p className="mb-8 text-lg opacity-90">
              Join thousands of readers discovering the best IT literature
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/auth/register')}
              className="text-lg"
            >
              Create Your Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
