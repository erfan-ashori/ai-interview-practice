import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Mic, BarChart, Brain, ArrowRight } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Brain,
      title: 'Real-time AI Feedback',
      description: 'Get instant, personalized feedback from our advanced AI interviewer powered by GPT-4o.',
    },
    {
      icon: Video,
      title: 'Video/Audio Practice',
      description: 'Practice with camera and microphone enabled to simulate real interview conditions.',
    },
    {
      icon: BarChart,
      title: 'Detailed Scoring',
      description: 'Receive comprehensive scores across 5 key metrics to identify strengths and areas for improvement.',
    },
    {
      icon: Mic,
      title: 'Multiple Interview Types',
      description: 'Practice behavioral, technical, or system design interviews at junior, mid, or senior levels.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">AI Interview Practice</h1>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-block">
            <span className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-full">
              AI-Powered Interview Coach
            </span>
          </div>
          <h2 className="text-5xl font-bold tracking-tight">
            Master Your Interview Skills
          </h2>
          <p className="text-xl text-muted-foreground">
            Practice interviews with AI and get instant, actionable feedback. 
            Build confidence and improve your performance before the real thing.
          </p>
          <div className="pt-4">
            <Link href="/interview/setup">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Interview Practice
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Ace Your Interview
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h3>
          <div className="space-y-6">
            {[
              {
                step: '1',
                title: 'Setup Your Interview',
                description: 'Choose your interview type (behavioral, technical, or system design) and difficulty level.',
              },
              {
                step: '2',
                title: 'Enable Camera & Microphone',
                description: 'Grant permissions and test your equipment to ensure a smooth experience.',
              },
              {
                step: '3',
                title: 'Practice with AI',
                description: 'Answer questions from our AI interviewer. Your responses are transcribed in real-time.',
              },
              {
                step: '4',
                title: 'Receive Detailed Feedback',
                description: 'Get comprehensive scores and actionable insights to improve your performance.',
              },
            ].map((item) => (
              <Card key={item.step}>
                <CardContent className="flex items-start gap-4 pt-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h3 className="text-3xl font-bold">
            Ready to Level Up Your Interview Game?
          </h3>
          <p className="text-lg text-muted-foreground">
            Join thousands of candidates who have improved their interview skills with AI-powered practice.
          </p>
          <Link href="/interview/setup">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2024 AI Interview Practice. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
