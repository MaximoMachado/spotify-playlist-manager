import { Box, Heading, Text, Link } from "@chakra-ui/react";
import { Link as RouterLink } from 'react-router-dom';


function Tool({ title, desc, path, ...style }) {
    return (
        <Box 
            padding={5}
            {...style}
        >
            <Heading>
                <Link
                    color='#4299E1'
                    textDecoration='underline'
                    _hover={{ textDecoration: 'none', color: 'blue.700' }}
                    as={RouterLink}
                    to={path}
                >
                    {title}
                </Link>
            </Heading>
            <Text marginTop={5}>{desc}</Text>
        </Box>
    )
}

export {Tool};