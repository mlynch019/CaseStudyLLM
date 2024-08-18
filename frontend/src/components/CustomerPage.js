import React, { useEffect } from 'react';
import { Box, Flex, useDisclosure, ChakraProvider } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Chatbot from './Chatbot';
import Popup from './Popup';

function CustomerPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  return (
    <ChakraProvider>
      <Flex h="100vh" bg="gray.100">
        <Sidebar />
        <Box flex="1" p="4">
          <Chatbot />
        </Box>
        <Popup isOpen={isOpen} onClose={onClose} />
      </Flex>
    </ChakraProvider>
  );
}

export default CustomerPage;
