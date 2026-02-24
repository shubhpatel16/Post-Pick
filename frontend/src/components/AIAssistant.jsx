import { useState } from 'react';
import axios from 'axios';
import { Form, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './aiAssistant.css';

const AIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { type: 'user', text: message };
    setChat((prev) => [...prev, userMsg]);
    setMessage('');
    setLoading(true);

    try {
      const { data } = await axios.post('/api/ai/chat', { message });

      const botMsg = {
        type: 'bot',
        text: data.reply,
        products: data.products,
      };

      setChat((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="ai-floating-btn">
        <Button
          className="ai-circle-btn"
          onClick={() => setOpen(!open)}
        >
          🤖
        </Button>
      </div>

      {/* Chat Box */}
      {open && (
        <div className="ai-chat-box">
          <div className="ai-header">
            AI Shopping Assistant
          </div>

          <div className="ai-messages">
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`ai-message ${msg.type}`}
              >
                <div className="ai-bubble">
                  {msg.text}

                  {msg.products &&
                    msg.products.map((product) => (
                      <div key={product._id} className="ai-product">
                        <Link to={`/product/${product._id}`}>
                          {product.name}
                        </Link>
                        <div>₹{product.price}</div>
                      </div>
                    ))}
                </div>
              </div>
            ))}

            {loading && (
              <div className="ai-message bot">
                <div className="ai-bubble">
                  <Spinner animation="border" size="sm" /> Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="ai-input">
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
            >
              <Form.Control
                type="text"
                placeholder="Ask me something..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Form>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;