import React, { useState } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
  VStack,
  Spinner,
  Center,
  Image,
} from '@chakra-ui/react';
import countryImage from './countryai.png'; // Ensure you have the image in the correct path

const ClaimsModel = () => {
  const [policyId, setPolicyId] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleCheckPrediction = async () => {
    if (!policyId) {
      toast({
        title: 'Policy ID is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ policy_id: policyId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: errorData.error || 'An error occurred',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setPrediction(null);
      } else {
        const data = await response.json();
        setPrediction(data.prediction);
      }
    } catch (error) {
      console.error('Error fetching prediction:', error);
      toast({
        title: 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="white" minHeight="100vh">
      <Center height="100%">
        <VStack spacing={9} p={8} bg="white" w={{ base: '90%', md: '60%', lg: '40%' }}>
          <Image src={countryImage} alt="Country Logo" width="600px" height="155px" />
          <Heading textAlign="center" color="green.700">
            Claim Predictor Model
          </Heading>
          <VStack spacing={6} align="stretch" width="100%">
            <FormControl id="policy-id">
              <FormLabel>Enter Policy ID</FormLabel>
              <Input
                type="text"
                value={policyId}
                onChange={(e) => setPolicyId(e.target.value)}
                placeholder="Policy ID"
                bg="white"
                border="2px solid"
                borderColor="green.500"
              />
            </FormControl>

            <Button backgroundColor="#005b40ff" color="white" onClick={handleCheckPrediction} isLoading={loading}>
              Check Prediction
            </Button>

            {loading && (
              <Center>
                <Spinner size="xl" />
              </Center>
            )}

            {prediction !== null && (
              <Box p={4} bg="white" borderRadius="md" boxShadow="lg" textAlign="center">
                <Text fontSize="xl" color={prediction === 1 ? 'red.500' : 'green.500'}>
                  {prediction === 1
                    ? 'This policy holder is likely to file a claim within 6 months.'
                    : 'This policy holder is not likely to file a claim within 6 months.'}
                </Text>
              </Box>
            )}
          </VStack>
        </VStack>
      </Center>
    </Box>
  );
};

export default ClaimsModel;
