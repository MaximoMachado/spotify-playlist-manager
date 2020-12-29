import { useState, useEffect } from 'react';
import { VStack, CircularProgress, Heading, CheckboxGroup, Checkbox, Button, Modal, ModalOverlay, ModalHeader, ModalContent, ModalBody, ModalFooter, ModalCloseButton, ButtonGroup, useToast, Divider } from '@chakra-ui/react';
import axios from 'axios';


function Settings({ isOpen, onClose, ...style}) {

    const toast = useToast();
    const [formValues, setFormValues] = useState({ playlistsToExclude: [] });
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [excludeAll, setExcludeAll] = useState(false);

    useEffect(() => {
        setLoading(true);
        if (isOpen === true) {
            axios.get(`${process.env.REACT_APP_API_URL}/user/settings`, { withCredentials: true })
                .then(res => {
                    setFormValues(res.data);
                })
                .catch(err => {
                    console.error(err);
                    onClose();
                })
            axios.get(`${process.env.REACT_APP_API_URL}/spotify/user-playlists`, { withCredentials: true})
                .then(res => {
                    setPlaylists(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
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

    useEffect(() => {
        if (excludeAll) {
            const exclude = playlists.map(playlist => playlist.uri);
            setFormValues({...formValues, playlistsToExclude: exclude})
        } else {
            setFormValues({...formValues, playlistsToExclude: []})
        }
    }, [excludeAll, playlists])

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
                <ModalBody display='flex' flexDirection='column' alignItems='center'>
                    {loading && 
                        <CircularProgress 
                            margin='50px' 
                            size={['100px', '100px', '50px', '50px']} 
                            isIndeterminate 
                            color='green.300'
                        />
                    }
                    {!loading && <>
                        <Heading size='md'>Multiple Playlist Searcher</Heading>
                        <Divider />
                        <Heading size='sm' margin='5px'>Songs to Exclude from Search Results</Heading>
                        <VStack alignItems='flex-start'>
                            <Checkbox 
                                isChecked={excludeAll}
                                onChange={(event) => setExcludeAll(!excludeAll)}
                            >
                                Exclude All Playlists
                            </Checkbox>
                            <CheckboxGroup 
                                value={formValues.playlistsToExclude}
                                onChange={(value) => setFormValues({ ...formValues,  playlistsToExclude: value})}
                            >
                                {playlists.map(playlist => <Checkbox key={playlist.uri} value={playlist.uri}>{playlist.name}</Checkbox>)}   
                            </CheckboxGroup>
                        </VStack>
                    </>}
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