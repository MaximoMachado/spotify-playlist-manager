import { useState, useEffect } from 'react';
import { VStack, CircularProgress, Heading, CheckboxGroup, Checkbox, Button, Modal, ModalOverlay, ModalHeader, ModalContent, ModalBody, ModalFooter, ModalCloseButton, ButtonGroup, useToast, Divider } from '@chakra-ui/react';
import axios from 'axios';
import { CheckboxList } from '../CheckboxList/CheckboxList';


function Settings({ isOpen, onClose, ...style}) {
    /**
     * Settings Modal for User
     * Props:
     * isOpen {boolean}: Whether Modal is open or not
     * onClose {function}: Called whenever Modal is closed
     */

    const toast = useToast();
    const [formValues, setFormValues] = useState({ playlistsToExclude: [], allowDuplicates: true });
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [excludeAll, setExcludeAll] = useState(false);

    useEffect(() => {
        setLoading(true);
        if (isOpen === true) {
            axios.get(`${process.env.REACT_APP_API_URL}/spotify/user-playlists`, { withCredentials: true})
                .then(res => {
                    setPlaylists(res.data);

                    axios.get(`${process.env.REACT_APP_API_URL}/user/settings`, { withCredentials: true })
                        .then(res => {
                            setFormValues(formValues => ({...formValues, ...res.data}));
                            setLoading(false);
                        })
                        .catch(err => {
                            toast({
                                title: 'Settings could not be opened.',
                                description: 'Please wait a bit and then try again.',
                                status: 'error',
                                duration: 9000,
                                isClosable: true,
                            });
                            console.error(err);
                            onClose();
                        })
                })
                .catch(err => {
                    toast({
                        title: 'Settings could not be opened.',
                        description: 'Please wait a bit and then try again.',
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    });
                    console.error(err);
                    onClose();
                })
        }
    }, [isOpen, onClose])

    useEffect(() => {
        if (excludeAll) {
            const exclude = playlists.map(playlist => playlist.uri);
            setFormValues(formValues => ({...formValues, playlistsToExclude: exclude}))
        } else {
            setFormValues(formValues => ({...formValues, playlistsToExclude: []}))
        }
    }, [excludeAll, playlists])

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
                <ModalHeader paddingBottom='0px'>Settings</ModalHeader>
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
                        <Heading size='md' margin='5px'>Multiple Playlist Searcher</Heading>
                        <Divider />
                        <Heading size='sm' margin='5px'>Songs to Exclude from Search Results</Heading>
                        <CheckboxList 
                            items={playlists.map(playlist => ({
                                key: playlist.uri,
                                value: playlist.uri,
                                name: playlist.name,
                            }))}
                            values={formValues.playlistsToExclude}
                            onValuesChange={(values) => setFormValues({ ...formValues,  playlistsToExclude: values })}
                            showToggleAll
                            toggleAllChecked={excludeAll}
                            onToggleAll={() => setExcludeAll(excludeAll => !excludeAll)}
                            toggleAllText="Exclude All Playlists"
                        />
                        <Heading size='md' margin='5px' marginTop='15px'>Playlist Set Operations</Heading>
                        <Divider />
                        <Checkbox 
                            marginTop='10px'
                            alignSelf='flex-start'
                            isChecked={formValues.allowDuplicates}
                            onChange={(event) => setFormValues(formValues => ({...formValues, allowDuplicates: !formValues.allowDuplicates}))}
                        >
                            Allow Duplicate Songs
                        </Checkbox>
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