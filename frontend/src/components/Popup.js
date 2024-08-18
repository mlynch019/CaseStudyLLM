import React, { useRef } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Text, Center, Box } from '@chakra-ui/react';
import axios from 'axios';

function Popup({ isOpen, onClose }) {
    const fileInputRef = useRef(null);

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post('http://127.0.0.1:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            onClose();
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <Box width="100%">
                    <Center>
                    <Box width="80%"> {/* Adjust the width as needed */}
                        <ModalHeader textAlign="center">Welcome to Country Companion</ModalHeader>
                    </Box>
                    </Center>
                </Box>
                <ModalBody>
                    <Center>
                        <Text>
                            Country Companion is an AI-powered chatbot designed to help you understand and manage your insurance policies with ease and confidence. Ask any questions about your policy, and get instant, accurate answers.
                        </Text>
                    </Center>
                </ModalBody>
                <ModalFooter>
                    <Box w="100%">
                        <Center>
                            <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleUpload}
                            accept="application/pdf"
                        />
                            <Button backgroundColor="#005b40ff" color="white" onClick={() => fileInputRef.current.click()}>
                            Upload Declaration Packet
                        </Button>
                    </Center>
                    </Box>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default Popup;