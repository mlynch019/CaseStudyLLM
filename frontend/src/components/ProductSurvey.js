import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Button,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
  Switch,
  Stack,
  Text,
  VStack,
  HStack,
  Image,
} from '@chakra-ui/react';

import countryImage from './countryai.png'; // Ensure you have the image in the correct path

const ProductSurvey = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [age, setAge] = useState(null);
  const [income, setIncome] = useState('');
  const [retirementAge, setRetirementAge] = useState(null);
  const [ownsCar, setOwnsCar] = useState(false);
  const [carWorth, setCarWorth] = useState('');
  const [miles, setMiles] = useState('');
  const [ownsHome, setOwnsHome] = useState(false);
  const [homeWorth, setHomeWorth] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const handleSubmit = async () => {
    onClose();

    const userMessage = { text: "Your custom recommendations...", sender: 'user' };
    setMessages([...messages, userMessage]);
    setInput('');

    const surveyData = {
      age,
      income,
      retirementAge,
      ownsCar,
      carWorth,
      miles,
      ownsHome,
      homeWorth,
      additionalInfo,
    };

    try {
      const response = await fetch('http://127.0.0.1:4000/process_message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ surveyData })
      });
      const data = await response.json();
      const botMessage = { text: data.response, sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, botMessage]);
      onClose();
    } catch (error) {
      console.error('Error submitting survey:', error);
    }
  };

  return (
    <Box p={6} bg="white" minHeight="100vh">
      <Center>
        <VStack spacing={9} p={8} bg="white" w={{ base: '90%', md: '60%', lg: '40%' }}>
          <Image src={countryImage} alt="Country Logo" width="600px" height="155px" />
          <Heading mb={4} textAlign="center" color="green.700">
            COUNTRY Client Info Survey
          </Heading>
          <Box w="100%" h="100%" p="4" bg="white" boxShadow="lg" borderRadius="md">
            <VStack spacing="4" h="100%">
              <Box flex="1" w="100%" overflowY="auto">
                {messages.map((msg, index) => (
                  <Box
                    key={index}
                    alignSelf={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
                    bg={msg.sender === 'user' ? 'green.600' : 'gray.200'}
                    color={msg.sender === 'user' ? 'white' : 'black'}
                    p="2"
                    borderRadius="md"
                    m="2"
                    whiteSpace="pre-wrap"
                  >
                    <Text>{msg.text}</Text>
                  </Box>
                ))}
              </Box>
              <HStack w="100%">
                {/* Additional components can go here */}
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Center>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="green.50">
          <ModalHeader>Survey</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>What is your client's age?</FormLabel>
                <Slider
                  defaultValue={0}
                  min={0}
                  max={100}
                  onChange={(val) => setAge(val)}
                  focusThumbOnChange={false}
                >
                  <SliderTrack bg="green.100">
                    <SliderFilledTrack bg="green.500" />
                  </SliderTrack>
                  <SliderThumb boxSize={6} />
                </Slider>
                <Text mt={2} color="green.700">Age: {age}</Text>
              </FormControl>

              <FormControl>
                <FormLabel>What is your client's annual income?</FormLabel>
                <Input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="Enter your income"
                  bg="white"
                />
              </FormControl>

              <FormControl>
                <FormLabel>What is your client's expected retirement age?</FormLabel>
                <Slider
                  defaultValue={0}
                  min={0}
                  max={100}
                  onChange={(val) => setRetirementAge(val)}
                  focusThumbOnChange={false}
                >
                  <SliderTrack bg="green.100">
                    <SliderFilledTrack bg="green.500" />
                  </SliderTrack>
                  <SliderThumb boxSize={6} />
                </Slider>
                <Text mt={2} color="green.700">Retirement Age: {retirementAge}</Text>
              </FormControl>

              <FormControl>
                <FormLabel>Does your client own a car?</FormLabel>
                <Switch
                  isChecked={ownsCar}
                  onChange={(e) => setOwnsCar(e.target.checked)}
                  colorScheme="green"
                />
              </FormControl>

              {ownsCar && (
                <>
                  <FormControl>
                    <FormLabel>What is your client's car worth?</FormLabel>
                    <Input
                      type="number"
                      value={carWorth}
                      onChange={(e) => setCarWorth(e.target.value)}
                      placeholder="Enter your car's worth"
                      bg="white"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>How many miles does your client drive a year?</FormLabel>
                    <Input
                      type="number"
                      value={miles}
                      onChange={(e) => setMiles(e.target.value)}
                      placeholder="Enter miles"
                      bg="white"
                    />
                  </FormControl>
                </>
              )}

              <FormControl>
                <FormLabel>Does your client own a home?</FormLabel>
                <Switch
                  isChecked={ownsHome}
                  onChange={(e) => setOwnsHome(e.target.checked)}
                  colorScheme="green"
                />
              </FormControl>

              {ownsHome && (
                <FormControl>
                  <FormLabel>What is your client's home worth?</FormLabel>
                  <Input
                    type="number"
                    value={homeWorth}
                    onChange={(e) => setHomeWorth(e.target.value)}
                    placeholder="Enter your home's worth"
                    bg="white"
                  />
                </FormControl>
              )}

              <FormControl>
                <FormLabel>Additional information</FormLabel>
                <Textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Any additional information"
                  bg="white"
                />
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleSubmit}>
              Submit
            </Button>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProductSurvey;
