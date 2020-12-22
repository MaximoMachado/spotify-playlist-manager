import axios from 'axios';
import { useState } from 'react';
import { Box, Input, InputGroup, Button, InputRightAddon } from '@chakra-ui/react';
import { StyledVStack } from "../StyledVStack/StyledVStack";

function Search({ searchUrl, createComponents, ...style}) {
    /**
     * Component that renders a searchbar and the results that appear underneath it
     * Props:
     * searchUrl {str}: Url to get search results from. Should have search, limit, and offset parameters
     * createComponents {func}: Recieves data from url and returns array of ReactComponents (Card) to render
     */
    
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = () => {
        axios.get(`${searchUrl}`, { withCredentials: true, params: { search: search } })
            .then(data => createComponents(data))
            .then(components => setResults(components))
            .catch(err => console.error(err))
    };

    return (
        <Box {...style}>
            <InputGroup>
                <Input 
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder='Search for a Song'
                />
                <InputRightAddon>
                    <Button onClick={handleSearch}>Search</Button>
                </InputRightAddon>
            </InputGroup>
            {results.length > 0 && 
                <StyledVStack>
                    {results}
                </StyledVStack>
            }
        </Box>
    );
}

export {Search};