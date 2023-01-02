import axios from 'axios';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useToast, Flex, Input, InputGroup, Button, InputRightAddon } from '@chakra-ui/react';
import { StyledVStack } from "../StyledVStack/StyledVStack";

function Search({ searchUrl, searchPlaceholderText, createComponents, searchForCurrentlyPlayingSong, ...style}) {
    /**
     * Component that renders a searchbar and the results that appear underneath it
     * Props:
     * searchUrl {str}: Url to get search results from. Should have search, limit, and offset parameters
     * searchPlaceHolderText {str}: Used for Search Input placeholder text and screenreaders
     * createComponents {func}: Recieves data from url and returns array of ReactComponents (Card) to render
     * searchForCurrentlyPlayingSong {func}: Takes no arguments and returns nothing to handle button press
     */
    
    const history = useHistory();
    const toast = useToast();
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = () => {
        axios.get(`${searchUrl}`, { withCredentials: true, params: { search: search } })
            .then(data => createComponents(data))
            .then(components => setResults(components))
            .catch(err => {
                console.error(err)
                if (err.response.status === 401) {
                    history.push('/');
                    toast({
                        title: 'Please login first and try again.',
                        status: 'warning',
                        duration: null,
                        isClosable: true,
                    });
                } else {
                    toast({
                        title: 'Something went wrong.',
                        description: 'Please wait a bit and then try again.',
                        status: 'error',
                        duration: null,
                        isClosable: true,
                    });
                }
            })
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <Flex flexDirection='column' alignItems='center' {...style}>
            <InputGroup
                boxShadow='md'
                rounded='md'
            >
                <Input
                    background='gray.50'
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={searchPlaceholderText}
                    aria-label={searchPlaceholderText}
                />
                <InputRightAddon padding={0}>
                    <Button
                        background='blue.300'
                        border='1px solid'
                        width='100%'
                        height='100%'
                        onClick={handleSearch}
                    >
                        Search
                    </Button>
                </InputRightAddon>
                <InputRightAddon padding={0}>
                    <Button
                        background='orange.400'
                        border='1px solid'
                        width='100%'
                        height='100%' 
                        onClick={searchForCurrentlyPlayingSong}
                    >
                        Playing Now
                    </Button>
                </InputRightAddon>
            </InputGroup>
            {results.length > 0 && 
                <StyledVStack width='100%' marginTop='15px'>
                    {results}
                </StyledVStack>
            }
        </Flex>
    );
}

export {Search};