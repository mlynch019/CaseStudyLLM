import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box, Flex, useDisclosure, ChakraProvider } from '@chakra-ui/react';
import Sidebar from './components/Sidebar';
import Chatbot from './components/Chatbot';
import LoginScreen from './components/LoginScreen';
import CustomerPage from './components/CustomerPage.js';
import Game from './components/Game';
import AgentPage from './components/AgentPage';
import ProductSurvey from './components/ProductSurvey';
import ClaimsModel from './components/ClaimsModel.js';

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/agent" element={<AgentPage />} />
          <Route path="/game" element={<Game />} />
          <Route path="/ProductSurvey" element={<ProductSurvey />} />
          <Route path="/ClaimsModel" element={<ClaimsModel />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}


export default App;
