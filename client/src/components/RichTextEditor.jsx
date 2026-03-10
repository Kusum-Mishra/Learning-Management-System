{/*import React, { useState } from 'react';
import ReactQuill from 'react-quill-new'; // Change this line
import 'react-quill-new/dist/quill.snow.css'; // And this line

const RichTextEditor = ({input, setInput}) => {
  const handleChange = (content) => {
    setInput({...input, description:content});
  }

  return <ReactQuill theme="snow" value={input.description} onChange={handleChange} />;
}

export default RichTextEditor;*/}

import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const RichTextEditor = ({ input, setInput }) => {
  const handleChange = (content) => {
    setInput((prev) => ({ ...prev, description: content }));
  };

  // Ensure value is never undefined/null to keep the component controlled
  return (
    <ReactQuill 
      theme="snow" 
      value={input.description || ""} 
      onChange={handleChange} 
    />
  );
};

export default RichTextEditor;