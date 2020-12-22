import axios from 'axios';
import { useState } from 'react';
import { Input, InputGroup, FormControl, Button, InputRightAddon } from '@chakra-ui/react';
import { StyledVStack } from "../StyledVStack/StyledVStack";

function Search({ searchUrl }) {

    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = () => {
        axios.get(`${searchUrl}`, { withCredentials: true, params: { search: search } })
            .then(data => {
                console.log(data);
            })
            .catch(err => console.error(err))
    };

    return (
        <>
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
            <StyledVStack>
                {results}
            </StyledVStack>
        </>
    );
}

export {Search};