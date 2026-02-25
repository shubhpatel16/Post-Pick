import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './aiAssistant.css';
import { TypeAnimation } from 'react-type-animation';
import { useNavigate } from 'react-router-dom';

const AIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [minimized, setMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newHistory = [...history, { role: 'user', content: message }];

    const userMsg = { type: 'user', text: message };
    setChat((prev) => [...prev, userMsg]);
    setMessage('');
    setLoading(true);

    try {
      const { data } = await axios.post('/api/ai/chat', {
        message,
        history: newHistory,
      });

      const botMsg = {
        type: 'bot',
        text: data.reply,
        products: data.products,
        animated: false,
      };

      setChat((prev) => [...prev, botMsg]);

      setTimeout(() => {
        setChat((prev) =>
          prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, animated: true } : m
          )
        );
      }, 2000);

      setHistory([...newHistory, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <div className='ai-floating-btn'>
        <Button className='ai-circle-btn' onClick={() => setOpen(!open)}>
          🤖
        </Button>
      </div>

      {/* Chat Box */}
      {open && (
        <div className='ai-chat-box'>
          <div className='ai-header'>
            AI Shopping Assistant
            <span
              style={{ float: 'right', cursor: 'pointer' }}
              onClick={() => setMinimized(!minimized)}
            >
              {minimized ? '⬆' : '⬇'}
            </span>
          </div>
          {!minimized && (
            <>
              <div className='ai-messages'>
                {chat.map((msg, index) => (
                  <div key={index} className={`ai-message ${msg.type}`}>
                    <div className='ai-avatar'>
                      {msg.type === 'user' ? 'U' : 'AI'}
                    </div>
                    <div className='ai-bubble'>
                      {msg.type === 'bot' && !msg.animated ? (
                        <TypeAnimation
                          sequence={[msg.text]}
                          speed={60}
                          cursor={false}
                        />
                      ) : (
                        msg.text
                      )}

                      {msg.products &&
                        msg.products.map((product) => (
                          <div key={product._id} className='ai-product'>
                            <Link to={`/product/${product._id}`}>
                              {product.name}
                            </Link>
                            <div>₹{product.price}</div>

                            <Button
                              size='sm'
                              variant='dark'
                              className='mt-2'
                              onClick={() =>
                                navigate(`/cart?productId=${product._id}&qty=1`)
                              }
                            >
                              Add To Cart
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className='ai-message bot'>
                    <div className='ai-bubble'>
                      <Spinner animation='border' size='sm' /> Thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className='ai-input'>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                >
                  <Form.Control
                    type='text'
                    placeholder='Ask me something...'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </Form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AIAssistant;
