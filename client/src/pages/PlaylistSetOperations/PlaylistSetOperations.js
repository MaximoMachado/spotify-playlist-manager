import { useState, useEffect, useRef } from 'react';
import { useMediaQuery, VStack, Flex, Heading, Button } from '@chakra-ui/react';
import { CheckboxList } from '../../components/CheckboxList/CheckboxList';
import { PageLayout } from "../../components/PageLayout/PageLayout";

function PlaylistSetOperations() {

    const [largerThan48Em] = useMediaQuery('(min-width: 48em) ');
    const playlistRef = useRef(null);
    const operationRef = useRef(null);

    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylists, setSelectedPlaylists] = useState([]);
    const [selectAll, setSelectAll] = useState(false);


    useEffect(() => {
        if (selectAll) {
            setSelectedPlaylists(playlists.map(playlist => playlist.uri));
        } else {
            setSelectedPlaylists([]);
        }
    }, [selectAll, playlists])
    
    return (
        <PageLayout showHeader>
            <VStack>
                <Flex
                    ref={playlistRef}
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
                    >
                        Select Two or More Playlists
                    </Heading>
                    <CheckboxList 
                        width='90%'
                        items={playlists.map(playlist => ({
                            key: playlist.uri,
                            value: playlist.uri,
                            name: playlist.name,
                        }))}
                        values={selectedPlaylists}
                        onValuesChange={(values) => setSelectedPlaylists(values)}
                        showToggleAll
                        toggleAllChecked={selectAll}
                        onToggleAll={() => setSelectAll(excludeAll => !excludeAll)}
                        toggleAllText="Select All Playlists"
                    />
                    <Button
                        alignSelf='flex-end'
                        onClick={() => operationRef.current.scrollIntoView()}
                    >
                        Choose these Playlists
                    </Button>
                </Flex>
                <Flex 
                    ref={operationRef}
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
                    >
                        Choose an Operation to Perform
                    </Heading>
                    <Flex alignSelf='flex-end'>
                        <Button
                            background='blue.200'
                            marginRight='15px'
                            shadow='md'
                            onClick={() => playlistRef.current.scrollIntoView()}
                        >
                            Go Back
                        </Button>
                        <Button
                            background='green.400'
                            shadow='md'
                        >Create the Playlist!
                        </Button>
                    </Flex>
                </Flex>
            </VStack>
        </PageLayout>
    )
}

export {PlaylistSetOperations};