import { Box, Heading, Text, Link } from "@chakra-ui/react";
import { useHistory } from 'react-router-dom';


function Tool({ title, desc, path, ...style }) {
    let history = useHistory();

    return (
        <Box 
            padding={5}
            {...style}
        >
            <Heading>
                <Link
                    color='#4299E1'
                    textDecoration='underline'
                    _hover={{ color: '#2C5282', textDecoration: 'none'}}
                    onClick={() => history.push(path)}
                >
                    {title}
                </Link>
            </Heading>
            <Text marginTop={5}>{desc}</Text>
        </Box>
    )
}

export {Tool};