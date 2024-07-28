import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { renderToStaticMarkup } from 'react-dom/server';

function MarkDown() {
  const [markDown, setMarkDown] = useState("Enter your text");
  const [fileName, setFileName] = useState("markdown.html");
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [showFileContainer, setShowFileContainer] = useState(false);
  const [showFileInput, setShowFileInput] = useState(false);
  const [createdFiles, setCreatedFiles] = useState([]);
  const [fileContents, setFileContents] = useState({});

  useEffect(() => {
    console.log("Loading files from localStorage");
    const savedFiles = JSON.parse(localStorage.getItem('createdFiles')) || [];
    const savedFileContents = JSON.parse(localStorage.getItem('fileContents')) || {};
    setCreatedFiles(savedFiles);
    setFileContents(savedFileContents);
  }, []);

  const updateLocalStorage = (files, contents) => {
    localStorage.setItem('createdFiles', JSON.stringify(files));
    localStorage.setItem('fileContents', JSON.stringify({
      ...JSON.parse(localStorage.getItem('fileContents') || '{}'),
      ...contents
    }));
  };

  const downloadMarkdown = () => {
    const htmlContent = renderToStaticMarkup(<ReactMarkdown>{markDown}</ReactMarkdown>);
    console.log("HTML Content: ", htmlContent);
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const saveFile = () => {
    if (fileName.trim() === "") return;
    setCreatedFiles(prev => {
      if (!prev.includes(fileName)) {
        return [...prev, fileName];
      }
      return prev;
    });
    setFileContents(prev => ({
      ...prev,
      [fileName]: markDown
    }));
    setShowFileContainer(true);
    setShowFileInput(false);
    const updatedCreatedFiles = createdFiles.includes(fileName)
      ? createdFiles
      : [...createdFiles, fileName];
    updateLocalStorage(updatedCreatedFiles, fileContents);
  };

  const createFile = () => {
    setShowFileInput(true);
  };

  const deleteFile = (fileToDelete) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      setCreatedFiles(prev => prev.filter(file => file !== fileToDelete));
      setFileContents(prev => {
        const updatedContents = { ...prev };
        delete updatedContents[fileToDelete];
        return updatedContents;
      });
      updateLocalStorage(createdFiles, fileContents);
      if (fileName === fileToDelete) {
        setFileName("");
        setMarkDown("Enter your text");
        setShowMarkdown(false);
      }
    }
  };

  const createFileContainer = () => {
    setShowFileContainer(prev => !prev);
  };

  const openFile = (name) => {
    setFileName(name);
    setMarkDown(fileContents[name] || "Enter your text");
    setShowMarkdown(true);
  };

  const handleMarkdownChange = (e) => {
    setMarkDown(e.target.value);
    if (createdFiles.includes(fileName)) {
      const newContents = { ...fileContents, [fileName]: e.target.value };
      setFileContents(newContents);
      updateLocalStorage(createdFiles, newContents);
    }
  };

  return (
    <>
      {!showMarkdown ? (
        <div>
          <div className='bg-black p-5 text-white font-mono text-center font-bold h-20 flex items-center justify-center relative'>
            <img src="hamburger.jpg" id='hamburger' onClick={createFileContainer} className='h-12 absolute left-5' />
            <h1 className='mx-auto max-ph:ml-24 max-ph:text-2xl'>Markdown Editor</h1>
          </div>

          {showFileContainer && (
            <div className='absolute top-20 left-0 bg-white h-screen w-64 flex flex-col items-center border-gray-200'>
              <h3 className='font-bold text-lg mb-2 mt-2'>Created Files</h3>
              <ul className='flex flex-col items-start p-0 w-full'>
                {createdFiles.map((file, index) => (
                  <li key={index} className='file-item cursor-pointer mb-1 bg-black text-white py-2 px-4 flex justify-between items-center font-mono hover:bg-zinc-600 w-full' onClick={() => openFile(file)}>
                    <span className='flex-1 overflow-hidden text-ellipsis whitespace-nowrap'>{file}</span>
                    <img src="delete.png" onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(file);
                    }} className='h-8 ml-2 flex-shrink-0' />
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className='bg-[url("/background.jpeg")] flex flex-col items-center justify-center h-screen bg-cover bg-center'>
            <h2 className='mb-4 font-mono text-5xl'>Welcome!</h2>
            <button onClick={createFile} className='bg-blue-500 text-white py-2 px-9 rounded hover:bg-blue-700'>
              Create a new file
            </button>
            {showFileInput && (
              <div>
                <input
                  type='text'
                  className='mt-4 py-2 px-4 rounded border border-gray-300 max-ph:ml-14'
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder='Enter file name'
                  required
                />
                <button onClick={saveFile} className='bg-blue-500 text-white py-2 px-9 ml-4 rounded hover:bg-blue-700 max-ph:ml-32 max-ph:mt-4'>Save</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div id='markdownfile' className='min-h-screen grid grid-cols-2 gap-0'>
          <textarea
            className='bg-black w-full box-border font-mono flex-1 p-4 h-full text-white resize-none'
            value={markDown}
            onChange={handleMarkdownChange}
          />
          <div className='relative bg-indigo-400 w-full box-border font-mono flex flex-col p-4 h-full overflow-auto'>
            <div className='flex-grow'>
              <ReactMarkdown>{markDown}</ReactMarkdown>
            </div>
            <button
              onClick={downloadMarkdown}
              className='absolute bottom-4 right-4 bg-blue-500 text-white py-2 px-9 rounded hover:bg-blue-700 min-[320px]:px-1 ml-4'
            >
              Download Markdown
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default MarkDown;


