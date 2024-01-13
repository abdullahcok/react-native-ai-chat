import React, { useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import axios from 'axios';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const openaiApiKey = '';

  const onSend = async (newMessages = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));

    const userMessage = newMessages[0].text;

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/engines/davinci-codex/completions',
        {
          prompt: userMessage,
          max_tokens: 100,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiApiKey}`,
          },
        }
      );

      if (response.data.choices && response.data.choices.length > 0) {
        const aiResponse = response.data.choices[0].text.trim();
        setMessages((prevMessages) =>
          GiftedChat.append(prevMessages, [
            { text: aiResponse, user: { _id: 2, name: 'Martian' } },
          ])
        );
      } else {
        console.error('Invalid API response:', response.data);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessages) => onSend(newMessages)}
      user={{ _id: 1, name: 'Alien' }}
    />
  );
};

export default ChatScreen;
