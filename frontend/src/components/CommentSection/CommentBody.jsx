import React, { useState } from 'react';
import styled from "styled-components";

const TextAreaContainer = styled.div`
  & {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  max-width: 800px;
}

 & textarea {
  flex: 1;
  min-height: 32px;
  max-height: 160px;
  resize: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  font-size: 16px;
  line-height: 1.5;
  outline: none;
}

  & textarea:focus {
  border-color: #4cb5f5;
}
`

const CommentBody = () => {
  const [value, setValue] = useState('');

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setValue(value + '\n');
    }
  };

  const handleChange = event => {
    setValue(event.target.value);
  };

  return (
    <TextAreaContainer>
      <textarea
        rows="1"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </TextAreaContainer>
  );
};

export default CommentBody;
