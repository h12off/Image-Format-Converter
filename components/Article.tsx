import React from 'react';
import { Article } from '../types';

interface ArticleProps {
  article: Article;
  onBack: () => void;
}

const ArticlePage: React.FC<ArticleProps> = ({ article, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto bg-slate-800/50 rounded-lg p-4 sm:p-8 animate-fade-in">
      <button onClick={onBack} className="text-indigo-400 hover:text-indigo-300 mb-6 flex items-center gap-2">
        &larr; Back to Blog
      </button>
      <article>
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{article.title}</h1>
          <p className="text-slate-400 text-sm">{article.date}</p>
        </header>
        <div className="prose prose-invert max-w-none text-slate-300 space-y-4">
          <article.content />
        </div>
      </article>
    </div>
  );
};

export default ArticlePage;
