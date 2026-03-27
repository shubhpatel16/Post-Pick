import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();

 
  const [keyword, setKeyword] = useState(urlKeyword || '');

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!keyword.trim()) {
      navigate('/');
      return;
    }

    try {
      const { data } = await axios.post('/api/search/smart-search', {
        query: keyword,
      });

      
      if (data && data.length > 0) {
        navigate('/', { state: { smartResults: data } });
      } else {
        
        navigate(`/search/${keyword.trim()}`);
      }

      setKeyword('');
    } catch (error) {
      console.error(error);

     
      navigate(`/search/${keyword.trim()}`);
    }
  };

  return (
    <Form onSubmit={submitHandler} className='d-flex'>
      <Form.Control
        type='text'
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder='Search Products...'
        className='mr-sm-2 ml-sm-5'
      ></Form.Control>
      <Button type='submit' variant='outline-success' className='p-2 mx-2'>
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
