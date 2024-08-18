import React from 'react';
import { Box, Button, Center, Text, VStack, HStack, Icon, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserTie } from 'react-icons/fa';
import countryImage from './countryai.png';

function LoginScreen() {
  const navigate = useNavigate();

  const handleCustomerClick = () => {
    navigate('/customer');
  };

  const handleAgentClick = () => {
    navigate('/agent');
  };

  const handleGameClick = () => {
    navigate('/game');
  };

  return (
    <Box bg="white" height="100vh">
      <Center height="100%">
        <VStack spacing={9} p={8} bg="white" w={{ base: '90%', md: '60%', lg: '40%' }}>
          <Image src={countryImage} alt="Country Logo" width="1200px" height="155px" /> 
          <Text fontSize="md" color="gray" textAlign="center" px={4}>
            Please choose your role to continue
          </Text>
          <HStack spacing={4} width="100%">
            <Button
              leftIcon={<Icon as={FaUser} />}
              bg="#005b40ff"
              color="white"
              _hover={{ bg: 'green.600' }}
              width="100%"
              py={6}
              onClick={handleCustomerClick}
            >
              Customer
            </Button>
            <Button
              leftIcon={<Icon as={FaUserTie} />}
              bg="#005b40ff"
              color="white"
              _hover={{ bg: 'green.600' }}
              width="100%"
              py={6}
              onClick={handleAgentClick}
            >
              Agent
            </Button>
          </HStack>
          <Button
            mt={4}
            bg="#005b40ff"
            color="white"
            _hover={{ bg: 'green.600' }}
            width="50%"
            py={6}
            onClick={handleGameClick}
          >
            Game
          </Button>
        </VStack>
      </Center>
    </Box>
  );
}

export default LoginScreen;
