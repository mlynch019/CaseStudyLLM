import React, { useRef } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Text } from '@chakra-ui/react';
import axios from 'axios';

function PopupAgent({ isOpen, onClose }) {
    const fileInputRef = useRef(null);

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post('http://127.0.0.1:4000/upload', formData, {
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
                <ModalHeader>AGENT</ModalHeader>
                <ModalBody>
                    <Text>AGENT</Text>
                </ModalBody>
                <ModalFooter>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleUpload}
                        accept="application/pdf"
                    />
                    <Button colorScheme="green" onClick={() => fileInputRef.current.click()}>Upload PDF</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default PopupAgent;