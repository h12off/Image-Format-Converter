import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { ImageFile, ConversionOptions, ConversionStatus, ConvertedFile, Article } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import FileUploader from './components/FileUploader';
import ConversionSettings from './components/ConversionSettings';
import Adsense from './components/Adsense';
import About from './components/About';
import Contact from './components/Contact';
import PrivacyPolicy from './components/PrivacyPolicy';
import Blog from './components/Blog';
import ArticlePage from './components/Article';
import { DownloadIcon, ZipIcon, TrashIcon } from './components/icons';
import { articles as blogArticles } from './blog/articles';
import { Analytics } from '@vercel/analytics/react';

// Make JSZip available from CDN
declare const JSZip: any;

type Page = 'converter' | 'privacy' | 'contact' | 'about' | 'blog' | 'article';

// --- AdSense Configuration ---
// IMPORTANT: To enable monetization, replace the placeholder IDs below with your actual Google AdSense values.
const AD_CLIENT_ID = 'ca-pub-XXXXXXXXXXXXXXXX'; // TODO: Replace with your actual Publisher ID
const AD_SLOT_HEADER_BANNER = 'YOUR_AD_SLOT_ID_HERE'; // TODO: Replace with your actual Ad Slot ID
const AD_SLOT_HOMEPAGE = 'YOUR_AD_SLOT_ID_HERE';     // TODO: Replace with your actual Ad Slot ID
const AD_SLOT_CONVERSION = 'YOUR_AD_SLOT_ID_HERE';  // TODO: Replace with your actual Ad Slot ID
const AD_SLOT_DOWNLOAD = 'YOUR_AD_SLOT_ID_HERE';    // TODO: Replace with your actual Ad Slot ID

// --- Web Worker Script ---
const workerScript = `
  self.onmessage = async (event) => {
    const { id, file, options } = event.data;
    try {
      const bitmap = await createImageBitmap(file);
      let { width, height } = bitmap;
      if (options.resize) {
        width = options.width;
        height = options.height;
      }
      
      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(bitmap, 0, 0, width, height);
      bitmap.close();

      const blob = await canvas.convertToBlob({
        type: \`image/\${options.format}\`,
        quality: options.format === 'jpeg' || options.format === 'webp' ? options.quality : undefined,
      });

      self.postMessage({
        id,
        success: true,
        payload: {
          convertedBlob: blob,
          originalSize: file.size,
          convertedSize: blob.size,
        }
      });
    } catch (error) {
      self.postMessage({ id, success: false, error: error.message });
    }
  };
`;

const App: React.FC = () => {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [status, setStatus] = useState<ConversionStatus>('idle');
  const [currentPage, setCurrentPage] = useState<Page>('converter');
  const [currentArticleSlug, setCurrentArticleSlug] = useState<string | null>(null);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [conversionOptions, setConversionOptions] = useState<ConversionOptions>({
    format: 'jpeg',
    quality: 0.8,
    resize: false,
    width: 1920,
    height: 1080,
  });
  
  const workerRef = useRef<Worker | null>(null);
  const conversionQueueRef = useRef<Map<string, ImageFile>>(new Map());

  // SEO effect
  useEffect(() => {
    let title = "Free Image Converter | Convert PNG to JPG, WebP & More Online";
    let description = "Convert images online for free with our secure, in-browser tool. Easily convert PNG to JPG, JPG to PNG, WebP, and GIF. Features batch conversion, resizing, and compression with no uploads required.";
    
    if (currentPage === 'article' && currentArticleSlug) {
        const article = blogArticles.find(a => a.slug === currentArticleSlug);
        if (article) {
            title = `${article.title} | Image Converter Blog`;
            description = article.description;
        }
    } else if (currentPage === 'blog') {
        title = "Blog | Image Converter";
        description = "Tips, tricks, and guides on image conversion, optimization, and web performance from the Image Converter team.";
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', description);
    }
  }, [currentPage, currentArticleSlug]);


  useEffect(() => {
    const blob = new Blob([workerScript], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    workerRef.current = new Worker(workerUrl);

    workerRef.current.onmessage = (event) => {
      const { id, success, payload, error } = event.data;
      const originalImageFile = conversionQueueRef.current.get(id);

      if (success && originalImageFile) {
        const { convertedBlob, originalSize, convertedSize } = payload;
        const convertedUrl = URL.createObjectURL(convertedBlob);
        
        const newConvertedFile: ConvertedFile = {
          ...originalImageFile,
          convertedUrl,
          originalSize,
          convertedSize,
        };
        
        setConvertedFiles(prev => [...prev, newConvertedFile]);

      } else {
        console.error(`Failed to convert image ${originalImageFile?.file.name}:`, error);
      }
      
      conversionQueueRef.current.delete(id);
      setConversionProgress(prev => prev + (1 / imageFiles.length) * 100);

      if (conversionQueueRef.current.size === 0) {
        setStatus('done');
      }
    };
    
    return () => {
      workerRef.current?.terminate();
      URL.revokeObjectURL(workerUrl);
    };
  }, [imageFiles.length]);


  const acceptedFileTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

  const handleFilesAdded = useCallback((files: File[]) => {
    const newImageFiles = files
      .filter(file => acceptedFileTypes.includes(file.type))
      .map(file => ({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }));
    setImageFiles(prev => [...prev, ...newImageFiles]);
    if (newImageFiles.length > 0) {
      setStatus('converting');
    }
  }, []);

  const removeImage = (idToRemove: string) => {
    setImageFiles(prev => prev.filter(img => {
        if(img.id === idToRemove) {
            URL.revokeObjectURL(img.previewUrl);
            return false;
        }
        return true;
    }));
  };

  const handleConvert = async () => {
    setConversionProgress(0);
    setConvertedFiles([]);

    if (imageFiles.length === 0 || !workerRef.current) return;
    
    conversionQueueRef.current.clear();
    imageFiles.forEach(file => {
      conversionQueueRef.current.set(file.id, file);
      workerRef.current?.postMessage({
        id: file.id,
        file: file.file,
        options: conversionOptions,
      });
    });
  };

  const handleDownload = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.replace(/\.[^/.]+$/, `.${conversionOptions.format}`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadAll = async () => {
    const zip = new (window as any).JSZip();
    const promises = convertedFiles.map(file => {
        const filename = file.file.name.replace(/\.[^/.]+$/, `.${conversionOptions.format}`);
        return fetch(file.convertedUrl)
            .then(res => res.blob())
            .then(blob => {
                zip.file(filename, blob);
            });
    });

    await Promise.all(promises);

    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = 'converted_images.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleReset = () => {
    imageFiles.forEach(f => URL.revokeObjectURL(f.previewUrl));
    convertedFiles.forEach(f => URL.revokeObjectURL(f.convertedUrl));
    setImageFiles([]);
    setConvertedFiles([]);
    setStatus('idle');
    setConversionProgress(0);
  };
  
  const handleViewArticle = (slug: string) => {
    setCurrentArticleSlug(slug);
    setCurrentPage('article');
    window.scrollTo(0, 0);
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const renderUploadScreen = () => (
    <div className="space-y-6">
      <FileUploader onFilesAdded={handleFilesAdded} disabled={status !== 'idle'} />
      <div className="text-center">
        <Adsense client={AD_CLIENT_ID} slot={AD_SLOT_HOMEPAGE} />
      </div>
       <div className="max-w-4xl mx-auto text-center text-slate-400">
        <h2 className="text-2xl font-semibold mb-3 text-white">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-slate-800/50 rounded-lg">
                <h3 className="font-bold text-lg text-indigo-400 mb-1">1. Upload</h3>
                <p className="text-sm">Drag & drop or select your images. Batch processing is fully supported.</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
                <h3 className="font-bold text-lg text-indigo-400 mb-1">2. Convert</h3>
                <p className="text-sm">Choose your target format, adjust quality, and resize if needed.</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
                <h3 className="font-bold text-lg text-indigo-400 mb-1">3. Download</h3>
                <p className="text-sm">Get your converted images instantly. It's fast, free, and secure.</p>
            </div>
        </div>
        <p className="mt-6 text-xs">All processing is done in your browser. Your files are never uploaded to a server.</p>
      </div>
    </div>
  );

  const renderConversionScreen = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
            <ConversionSettings options={conversionOptions} setOptions={setConversionOptions} disabled={conversionQueueRef.current.size > 0} />
            <Adsense client={AD_CLIENT_ID} slot={AD_SLOT_CONVERSION} />
        </div>

        <div className="bg-slate-800/50 rounded-lg p-6 max-h-[40vh] sm:max-h-[60vh] overflow-y-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Files to Convert ({imageFiles.length})</h3>
          <div className="space-y-4">
            {imageFiles.map((image) => (
              <div key={image.id} className="flex items-center bg-slate-700 p-3 rounded-md">
                <img src={image.previewUrl} alt={image.file.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                <div className="flex-grow">
                  <p className="text-sm font-medium text-white truncate">{image.file.name}</p>
                  <p className="text-xs text-slate-400">{formatBytes(image.file.size)}</p>
                </div>
                <button onClick={() => removeImage(image.id)} className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center pt-4">
        {conversionQueueRef.current.size > 0 && (
          <div className="w-full max-w-md bg-slate-700 rounded-full h-2.5 mb-4">
            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${conversionProgress}%` }}></div>
            <p className="text-center text-sm mt-2">{Math.round(conversionProgress)}% Complete</p>
          </div>
        )}
        <button
          onClick={handleConvert}
          disabled={conversionQueueRef.current.size > 0 || imageFiles.length === 0}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg"
        >
          {conversionQueueRef.current.size > 0 ? 'Converting...' : `Convert ${imageFiles.length} ${imageFiles.length === 1 ? 'File' : 'Files'}`}
        </button>
      </div>
    </div>
  );
  
  const renderDownloadScreen = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold text-center">Conversion Complete!</h2>
      <div className="bg-slate-800/50 rounded-lg p-6 space-y-4 max-h-[50vh] overflow-y-auto">
        {convertedFiles.map(file => {
           const sizeDiff = file.convertedSize - file.originalSize;
           const percentDiff = file.originalSize > 0 ? (sizeDiff / file.originalSize) * 100 : 0;
          return (
            <div key={file.id} className="flex items-center bg-slate-700 p-3 rounded-md">
              <img src={file.convertedUrl} alt={file.file.name} className="w-16 h-16 object-cover rounded-md mr-4" />
              <div className="flex-grow">
                <p className="text-sm font-medium text-white truncate">{file.file.name.replace(/\.[^/.]+$/, `.${conversionOptions.format}`)}</p>
                 <p className={`text-xs ${sizeDiff > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {formatBytes(file.convertedSize)} ({percentDiff.toFixed(1)}%)
                  </p>
              </div>
              <button
                onClick={() => handleDownload(file.convertedUrl, file.file.name)}
                className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
              >
                <DownloadIcon className="w-4 h-4" />
                Download
              </button>
            </div>
          )
        })}
      </div>
      <div className="text-center space-y-4">
        {convertedFiles.length > 1 && (
            <button
              onClick={handleDownloadAll}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg inline-flex items-center gap-2"
            >
              <ZipIcon className="w-5 h-5" />
              Download All as ZIP
            </button>
        )}
        <Adsense client={AD_CLIENT_ID} slot={AD_SLOT_DOWNLOAD} />
        <div>
           <button onClick={handleReset} className="text-slate-400 hover:text-white transition-colors">
              Convert More Images
           </button>
        </div>
      </div>
    </div>
  );

  const renderConverter = () => (
    <>
      {status === 'idle' && renderUploadScreen()}
      {status === 'converting' && renderConversionScreen()}
      {status === 'done' && renderDownloadScreen()}
    </>
  );

  const renderPage = () => {
    const article = blogArticles.find(a => a.slug === currentArticleSlug);
    switch (currentPage) {
        case 'privacy':
            return <PrivacyPolicy onBack={() => setCurrentPage('converter')} />;
        case 'contact':
            return <Contact onBack={() => setCurrentPage('converter')} />;
        case 'about':
            return <About onBack={() => setCurrentPage('converter')} />;
        case 'blog':
            return <Blog articles={blogArticles} onSelectArticle={handleViewArticle} onBack={() => setCurrentPage('converter')} />;
        case 'article':
            return article ? <ArticlePage article={article} onBack={() => setCurrentPage('blog')} /> : <p>Article not found.</p>;
        case 'converter':
        default:
            return renderConverter();
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-6">
            <Adsense client={AD_CLIENT_ID} slot={AD_SLOT_HEADER_BANNER} />
        </div>
        {renderPage()}
      </main>
      <Footer setCurrentPage={setCurrentPage} />
      <Analytics />
    </div>
  );
};

export default App;
