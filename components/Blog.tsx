import React from 'react';
import { Article } from '../types';

interface BlogProps {
  articles: Article[];
  onSelectArticle: (slug: string) => void;
  onBack: () => void;
}

const Blog: React.FC<BlogProps> = ({ articles, onSelectArticle, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button onClick={onBack} className="text-indigo-400 hover:text-indigo-300 mb-6 flex items-center gap-2">
        &larr; Back to Converter
      </button>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Our Blog</h1>
        <p className="mt-3 text-lg text-slate-400">
          Tips, tricks, and guides for all your image conversion needs.
        </p>
      </div>
      <div className="space-y-8">
        {articles.map((article) => (
          <div key={article.slug} className="bg-slate-800/50 rounded-lg p-6 transition-transform hover:scale-[1.02]">
            <p className="text-sm text-slate-400 mb-2">{article.date}</p>
            <h2 className="text-2xl font-bold text-white mb-3">{article.title}</h2>
            <p className="text-slate-300 mb-4">{article.description}</p>
            <button
              onClick={() => onSelectArticle(article.slug)}
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Read more &rarr;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
