import { Button, Modal, ModalOverlay, ModalHeader, ModalContent, ModalBody, ModalFooter, ModalCloseButton, ButtonGroup, useToast } from '@chakra-ui/react';
import axios from 'axios';


function Settings({ isOpen, onClose, ...style}) {

    const toast = useToast();

    const handleSave = () => {
        
    }

    return (
        <Modal 
            isOpen={isOpen}
            onClose={onClose}
            scrollBehavior='inside'
            isCentered
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
                        <Button backgroundColor='blue.300'>Save Settings</Button>
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