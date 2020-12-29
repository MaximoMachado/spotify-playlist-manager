import { useState, useEffect } from 'react';
import { Button, Modal, ModalOverlay, ModalHeader, ModalContent, ModalBody, ModalFooter, ModalCloseButton, ButtonGroup, useToast } from '@chakra-ui/react';
import axios from 'axios';


function Settings({ isOpen, onClose, ...style}) {

    const toast = useToast();
    const [formValues, setFormValues] = useState({});

    useEffect(() => {
        if (isOpen === true) {
            axios.get(`${process.env.REACT_APP_API_URL}/user/settings`, { withCredentials: true })
                .then(res => {
                    setFormValues(res.data);
                })
                .catch(err => {
                    console.error(err);
                    onClose();
                })
        }
    }, [isOpen, onClose])

    const handleSave = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/user/settings`, { settings: formValues }, { withCredentials: true })
            .then(res => {
                onClose();
                toast({
                    title: 'Settings successfully saved!',
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                });
            })
            .catch(err => {
                console.error(err);
                toast({
                    title: 'Settings could not be saved.',
                    description: 'Please wait a bit and then try again.',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });
            })
    }

    return (
        <Modal 
            isOpen={isOpen}
            onClose={onClose}
            scrollBehavior='inside'
            isCentered
            closeOnOverlayClick={false}
            {...style}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Settings</ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                </ModalBody>
                <ModalFooter textColor='white'>
                    <ButtonGroup spacing='3'>
                        <Button 
                            backgroundColor='blue.300'
                            onClick={() => handleSave()}
                        >
                            Save Settings
                        </Button>
                        <Button 
                            variant='outline' 
                            colorScheme='red'
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export {Settings};