import axios from 'axios';
import { useState } from 'react';
import { Input, InputGroup, FormControl, Button, InputRightAddon } from '@chakra-ui/react';
import { StyledVStack } from "../StyledVStack/StyledVStack";

function Search({ searchUrl }) {

    const [results, setResults] = useState([]);

    const handleSearch = (values) => {
        const { search } = values;

        axios.get(`${searchUrl}`, { withCredentials: true, params: { search: search } })
            .then(data => {
                console.log(data);
            })
            .catch(err => console.error(err))
    };

    return (
        <>
            <FormControl onSubmit={handleSearch}>
                <InputGroup>
                    <Input 
                        name='search'
                        placeholder='Search for a song' 
                        isRequired 
                    />
                    <InputRightAddon>
                        <Button type='submit'>Search</Button>
                    </InputRightAddon>
                </InputGroup>
            </FormControl>
            <StyledVStack>
                {results}
            </StyledVStack>
        </>
    );
}

export {Search};