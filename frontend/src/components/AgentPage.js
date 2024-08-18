import React from 'react';
import {
  Box,
  SimpleGrid,
  Heading,
  Icon,
  VStack,
  HStack,
  Button,
  Image,
  Center,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaPoll, FaClipboard } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import countryImage from './countryai.png'; // Ensure you have the image in the correct path

const tools = [
  { name: 'Product Survey', icon: FaPoll, path: '/ProductSurvey' },
  { name: 'Predictive Claims Model', icon: FaClipboard, path: '/ClaimsModel' },
];

const AgentPage = () => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue('#005b40ff', 'green.300');

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <Box bg="white" minHeight="100vh">
      <Center height="100%">
        <VStack spacing={9} p={8} bg="white" w={{ base: '90%', md: '60%', lg: '40%' }}>
          <Image src={countryImage} alt="Country Logo" width="1200px" height="155px" />
          <Heading as="h1" mb={6} textAlign="center" color="green.700">
            Agent Tools
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} width="100%">
            {tools.map((tool) => (
              <Box
                key={tool.name}
                bg={cardBg}
                color="white"
                _hover={{ bg: 'green.600', cursor: 'pointer' }}
                p={5}
                borderRadius="md"
                boxShadow="lg"
                onClick={() => handleCardClick(tool.path)}
              >
                <VStack>
                  <Icon as={tool.icon} boxSize={12} />
                  <Heading size="md" mt={4} textAlign="center">
                    {tool.name}
                  </Heading>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Center>
    </Box>
  );
};

export default AgentPage;
