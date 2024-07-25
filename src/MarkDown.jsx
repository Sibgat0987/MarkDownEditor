import React, { useState,useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

function MarkDown() {
  const [markDown, setMarkDown] = useState("Enter your text");
  const [fileName, setFileName] = useState("markdown.txt");
  const[showmarkdown,setShowmarkdown]=useState(false);
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
  useEffect(() => {
    console.log("Saving files to localStorage", createdFiles, fileContents);

    localStorage.setItem('createdFiles', JSON.stringify(createdFiles));
    localStorage.setItem('fileContents', JSON.stringify(fileContents));
  }, [createdFiles, fileContents]);
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

const saveFile=()=>{
  if (fileName.trim() === "") return;
  if (createdFiles.includes(fileName)) {
    alert("A file with this name already exists. Please choose a different name.");
    return;
  }
  setCreatedFiles(prev=>[...prev, fileName]);
  setFileContents(prev=>({ ...prev, [fileName]: markDown }));
  
  setShowFileContainer(true)

  setShowFileInput(false);
  

}
const createFile=()=>{
  setShowFileInput(true)
   //saveFile()
}
const deleteFile = (fileToDelete) => {
  if (window.confirm("Are you sure you want to delete this file?")) {
    setCreatedFiles(prev => prev.filter(file => file !== fileToDelete));
    setFileContents(prev => {
      const updatedContents = { ...prev };
      delete updatedContents[fileToDelete];
      return updatedContents;
    }
  );
  if (fileName === fileToDelete) {
    setFileName("");
    setMarkDown("Enter your text");
    setShowmarkdown(false);
  }
}
}
const createFilecontainer=()=>{
  setShowFileContainer(prev=>!prev)
}
const openFile = (name) => {
  setFileName(name);
  setMarkDown(fileContents[name] || "Enter your text");
  setShowmarkdown(true);
};

  return (
    <>
     { !showmarkdown ?(
      <div>
<div className='bg-black p-5 text-white font-mono text-center font-bold text-3xl h-20 flex items-center justify-center relative'>
  <img src="hamburger.jpg" id='hamburger' onClick={createFilecontainer} className='h-12 absolute left-5' />
  <h1 className='mx-auto'>Markdown Editor</h1>
</div>

{showFileContainer &&( <div className='absolute top-20 left-0 bg-white h-screen w-64 flex flex-col items-center '>
<h3 className='font-bold text-lg mb-2 mt-2'>Created Files</h3>
<ul className='flex flex-col items-start p-0 '>
{createdFiles.map((file,index)=>(
   <li key={index} className='file-item cursor-pointer mb-1 bg-black text-white py-2 px-16 flex justify-between items-center font-mono hover:bg-zinc-600' onClick={() => openFile(file)}>
   <span >{file}</span>
   <img src="delete.png"  onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the openFile function
                        deleteFile(file);
                      }} className='h-8 ml-5' />
 </li>
))}
</ul>
</div>)}
    <div className='bg-[url("background.jpeg")] flex flex-col items-center justify-center h-screen bg-cover bg-center'>
  <h2 className='mb-4 font-mono text-5xl'>Welcome!</h2>
  <button onClick={createFile} className='bg-blue-500 text-white py-2 px-9 rounded hover:bg-blue-700'>
    Create a new file
  </button>
{ showFileInput &&(
  <div>
 <input
          type='text' 
          className='mt-4 py-2 px-4 rounded border border-gray-300' 
          value={fileName} 
          onChange={(e) => setFileName(e.target.value)} 
          placeholder='Enter file name'
          required
        />
        <button onClick={saveFile} className='bg-blue-500 text-white py-2 px-9 ml-4 rounded hover:bg-blue-700'>Save</button>
  </div>
 
)
     }
</div>


      </div>
   
    ) :(
     <div id='markdownfile' className='min-h-screen grid grid-cols-2 gap-0'>
      <textarea 
        className='bg-black w-full box-border font-mono flex-1 p-4 h-full text-white resize-none' 
        value={markDown} 
        onChange={(e) => setMarkDown(e.target.value)} 
      />
      <div className='relative bg-indigo-400 w-full box-border font-mono flex flex-col p-4 h-full overflow-auto'>
        <div className='flex-grow'>
          <ReactMarkdown>{markDown}</ReactMarkdown>
        </div>

        <button 
          onClick={downloadMarkdown} 
          className='absolute bottom-4 right-4 bg-blue-500 text-white py-2 px-9 rounded hover:bg-blue-700'
        >
          Download Markdown
        </button>
      </div>
    </div>
    
    )
  }
    </>
   
  );
}

export default MarkDown;

