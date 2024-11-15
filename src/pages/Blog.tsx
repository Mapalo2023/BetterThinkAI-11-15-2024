import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: 'The Future of AI in Business Decision Making',
      excerpt: 'Explore how artificial intelligence is transforming the way businesses make strategic decisions and plan for the future.',
      author: 'Sarah Johnson',
      date: '2024-03-14',
      category: 'AI & Business',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e'
    },
    {
      id: 2,
      title: 'Implementing Design Thinking with AI Assistance',
      excerpt: 'Learn how AI can enhance and streamline your design thinking process, from ideation to testing.',
      author: 'Michael Chen',
      date: '2024-03-12',
      category: 'Design',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'
    },
    {
      id: 3,
      title: 'The Rise of AI-Powered Problem Solving',
      excerpt: 'Discover how businesses are using AI to tackle complex challenges and find innovative solutions.',
      author: 'Emily Rodriguez',
      date: '2024-03-10',
      category: 'Innovation',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0D14]">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Latest Insights & News
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Stay updated with the latest trends, insights, and best practices in AI and business innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500 transition-colors"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {post.author}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-400 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-400">{post.category}</span>
                  <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Load More Posts
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}