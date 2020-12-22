import { Box, Heading, Text, Link } from "@chakra-ui/react";
import { Link as RouterLink } from 'react-router-dom';


function Tool({ title, description, path, ...style }) {
    /**
     * Displays one of the various tools available on the site
     * Props:
     * title {str}: Name of the Tool
     * description {str}: Description of the Tool
     * path {str}: Relative path to the Tool on the website
     */
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
            <Text marginTop={5}>{description}</Text>
        </Box>
    )
}

export {Tool};