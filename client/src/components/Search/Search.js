import axios from 'axios';
import { useState } from 'react';
import { Box, Input, InputGroup, Button, InputRightAddon } from '@chakra-ui/react';
import { StyledVStack } from "../StyledVStack/StyledVStack";
import { Track } from '../Track/Track';

function Search({ searchUrl, ...style}) {

    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = () => {
        axios.get(`${searchUrl}`, { withCredentials: true, params: { search: search } })
            .then(data => {
                const { items } = data.data.body.tracks;
                setResults(items.map(item => {
                    return <Track track={item} fullInfo/>;
                }));
            })
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