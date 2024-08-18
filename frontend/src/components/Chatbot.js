import React, { useState } from 'react';
import { Box, VStack, HStack, Input, Button, Text } from '@chakra-ui/react';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const response = await fetch('http://127.0.0.1:5000/process_message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await response.json();
      const botMessage = { text: data.response, sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
    }
  };

  return (
    <Box w="100%" h="100%" p="4" bg="white" boxShadow="lg" borderRadius="md" border="10px solid" borderColor="white" p="5">
      <VStack spacing="4" h="100%">
        <Box flex="1" w="100%" overflowY="auto" p ='2' borderRadius="md" border="15px solid" borderColor="white" boxShadow="lg">
          {messages.map((msg, index) => (
            <Box key={index} alignSelf={msg.sender === 'user' ? 'flex-end' : 'flex-start'} bg={msg.sender === 'user' ? "#005b40ff" : 'gray.200'} color={msg.sender === 'user' ? 'white' : 'black'} p="2" borderRadius="md" m="2">
              <Text>{msg.text}</Text>
            </Box>
          ))}
        </Box>
        <Box w = "100%" boxShadow = "lg">
        <HStack w="100%">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." />
          <Button onClick={sendMessage} backgroundColor="#005b40ff" color = "white">Send</Button>
        </HStack>
        </Box>
      </VStack>
    </Box>
  );
}

export default Chatbot;
