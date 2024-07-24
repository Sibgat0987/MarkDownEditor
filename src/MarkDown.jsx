import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

function MarkDown() {
  const [markDown, setMarkDown] = useState("Enter your text");
  const [fileName, setFileName] = useState("markdown.txt");

  const downloadMarkdown = () => {
    const blob = new Blob([markDown], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className='min-h-screen grid grid-cols-2 gap-0'>
      <textarea 
        className='bg-black w-full box-border font-mono flex-1 p-4 h-full text-white resize-none' 
        value={markDown} 
        onChange={(e) => setMarkDown(e.target.value)} 
      />
      <div className='relative bg-slate-400 w-full box-border font-mono flex flex-col p-4 h-full overflow-auto'>
        <div className='flex-grow'>
          <ReactMarkdown>{markDown}</ReactMarkdown>
        </div>
        <input 
          type='text' 
          className='absolute bottom-16 right-4 py-2 px-4 rounded border border-gray-300' 
          value={fileName} 
          onChange={(e) => setFileName(e.target.value)} 
          placeholder='Enter file name'
        />
        <button 
          onClick={downloadMarkdown} 
          className='absolute bottom-4 right-4 bg-blue-500 text-white py-2 px-9 rounded hover:bg-blue-700'
        >
          Download Markdown
        </button>
      </div>
    </div>
  );
}

export default MarkDown;

