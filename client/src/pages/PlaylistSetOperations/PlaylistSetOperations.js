import { useState, useEffect, } from 'react';
import { useMediaQuery, VStack, Flex, Box, Heading, Text, Button, useToast, StackDivider, Divider, Select } from '@chakra-ui/react';
import { CheckboxList } from '../../components/CheckboxList/CheckboxList';
import { PageLayout } from "../../components/PageLayout/PageLayout";
import axios from 'axios';

function PlaylistSetOperations() {

    const [largerThan48Em] = useMediaQuery('(min-width: 48em) ');
    const toast = useToast();

    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylists, setSelectedPlaylists] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    // Either 
    const [operation, setOperation] = useState('');

    const [step, setStep] = useState(0);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/spotify/user-playlists`, { withCredentials: true})
            .then(res => setPlaylists(res.data))
            .catch(err => {
                console.error(err);
                toast({
                    title: 'Unable to load user playlists.',
                    description: 'Please wait a bit and then try again.',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });
            })
    }, [toast]);

    useEffect(() => {
        if (selectAll) {
            setSelectedPlaylists(playlists.map(playlist => playlist.uri));
        } else {
            setSelectedPlaylists([]);
        }
    }, [selectAll, playlists])

    const handleCreate = () => {

    }
    
    return (
        <PageLayout showHeader>
            <VStack>
                {(step === 1) && <Flex
                    flexDirection='column'
                    justifyContent='center'
                    alignItems='center'
                    padding={5}
                    background='#F7FAFC'
                    boxShadow='md'
                    border='1px'
                    borderColor='gray.200'
                    height='80vh'
                >
                    <Heading
                        textAlign='center'
                        marginBottom={5}
                    >
                        Select Two or More Playlists
                    </Heading>
                    <CheckboxList 
                        width='90%'
                        height='90%'
                        items={playlists.map(playlist => ({
                            key: playlist.uri,
                            // Value split by ||| to allow easy access to playlist name in Select 
                            // Without going through entire array of playlists to match uri
                            value: `${playlist.uri}|||${playlist.name}`,
                            name: playlist.name,
                        }))}
                        values={selectedPlaylists}
                        onValuesChange={(values) => setSelectedPlaylists(values)}
                        showToggleAll
                        toggleAllChecked={selectAll}
                        onToggleAll={() => setSelectAll(excludeAll => !excludeAll)}
                        toggleAllText="Select All Playlists"
                    />
                    <Flex alignSelf='flex-end' marginTop={5}>
                        <Button
                            background='red.300'
                            marginRight='15px'
                            shadow='md'
                            onClick={() => setStep(0)}
                        >
                            Go Back
                        </Button>
                        <Button
                            background='green.400'
                            shadow='md'
                            onClick={() => handleCreate()}
                        >
                            Create the Playlist(s)!
                        </Button>
                    </Flex>
                </Flex>}
                {(step === 0) && <Flex
                    flexDirection='column'
                    justifyContent='center'
                    alignItems='center'
                    padding={5}
                    background='#F7FAFC'
                    boxShadow='md'
                    border='1px'
                    borderColor='gray.200'
                >
                    <Heading
                        textAlign='center'
                        marginBottom={5}
                    >
                        Choose an Operation to Perform
                    </Heading>
                    <VStack
                        alignItems='flex-start'
                        spacing={5}
                        divider={<StackDivider borderColor="#2D3748" />}
                    >
                        <Box>
                            <Heading size='lg'>Union</Heading>
                            <Text>Includes every song from the selected playlists.</Text>
                        </Box>
                        <Box>
                            <Heading size='lg'>Intersection</Heading>
                            <Text>Includes only songs contained within every selected playlist.</Text>
                        </Box>
                        <Box>
                            <Heading size='lg'>Difference</Heading>
                            <Text>Includes every song from one playlist that are not in the other selected playlists.</Text>
                        </Box>
                        <Box>
                            <Heading size='lg'>Symmetric Difference</Heading>
                            <Text>Includes only songs from each selected playlist that are not from the other selected playlists.</Text>
                        </Box>
                        <Box width='70%'>
                            <Heading size='md' marginLeft={3} marginBottom={3}>Select an Operation</Heading>
                            <Select
                                border='1px'
                                borderColor='gray.300'
                                shadow='md'
                                placeholder="Select an operation"
                                onChange={(event) => setOperation(event.target.value)}
                            >
                                <option value="union">Union</option>
                                <option value="intersection">Intersection</option>
                                <option value="difference">Difference</option>
                                <option value="symmetricDifference">Symmetric Difference</option>
                            </Select>
                        </Box>
                    </VStack>
                    
                    <Button
                        background='blue.200'
                        marginTop={5}
                        alignSelf='flex-end'
                        onClick={() => setStep(1)}
                    >
                        Select the Operation
                    </Button>
                </Flex>}
            </VStack>
        </PageLayout>
    )
}

export {PlaylistSetOperations};