import React from 'react';
import { Box, VStack, Text, Link, Button, Image } from '@chakra-ui/react';
import countryImage from './countryai.png';

function Sidebar() {
  return (
    <Box w="260px" bg="white" color="black" p="10" boxShadow="lg">
      <Box mb="8" textAlign="center">
        <Image src={countryImage} alt="Country Logo" width="700px" height="50px" /> 
      </Box>
      <Box w="100%" h="80%" boxShadow="lg" p="8" backgroundColor="white">
      <VStack spacing="4" align="stretch">
        <Link href="#" color="#005b40ff" _hover={{ textDecoration: 'none', bg: 'green.600' }} p="2" borderRadius="lg" fontWeight="bold" >Home</Link>
        <Link href="#" color="#005b40ff" _hover={{ textDecoration: 'none', bg: 'green.600' }} p="2" borderRadius="lg" fontWeight="bold">About</Link>
        <Link href="#" color="#005b40ff" _hover={{ textDecoration: 'none', bg: 'green.600' }} p="2" borderRadius="lg" fontWeight="bold">Services</Link>
        <Link href="#" color="#005b40ff" _hover={{ textDecoration: 'none', bg: 'green.600' }} p="2" borderRadius="lg" fontWeight="bold">Contact</Link>
      </VStack>
      {/* <Box mt="48" >
        <Button backgroundColor="#005b40ff" color = "white" size="md">Upload Packet</Button>
      </Box> */}
      </Box>
    </Box>
  );
}

export default Sidebar;
