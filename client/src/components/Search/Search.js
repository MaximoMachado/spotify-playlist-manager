import axios from 'axios';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Flex, Input, InputGroup, Button, InputRightAddon } from '@chakra-ui/react';
import { StyledVStack } from "../StyledVStack/StyledVStack";

function Search({ searchUrl, createComponents, ...style}) {
    /**
     * Component that renders a searchbar and the results that appear underneath it
     * Props:
     * searchUrl {str}: Url to get search results from. Should have search, limit, and offset parameters
     * createComponents {func}: Recieves data from url and returns array of ReactComponents (Card) to render
     */
    
    const history = useHistory();
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = () => {
        axios.get(`${searchUrl}`, { withCredentials: true, params: { search: search } })
            .then(data => createComponents(data))
            .then(components => setResults(components))
            .catch(err => {
                console.error(err)
                if (err.response.status === 401) history.push('/');
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
                    placeholder='Search for a Song'
                />
                <InputRightAddon padding={0}>
                    <Button 
                        width='100%'
                        height='100%' 
                        onClick={handleSearch}
                    >
                        Search
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