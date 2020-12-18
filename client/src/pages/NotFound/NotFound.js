import './NotFound.css';
import { Flex, Spacer, Heading, Text, Button } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';

function NotFound() {
    let history = useHistory();

    return (
        <Flex 
            justify='center' 
            align='center' 
            width='100vw' 
            height='100vh'
            background='#EBF8FF'
        >
            <Flex direction='column' align='center' height='25%'>
                <Heading>Error 404</Heading>
                <Text>Sorry! The page you were looking for doesn't exist.</Text>

                <Spacer />
                <Button
                    boxShadow='md'
                    onClick={() => history.goBack()}
                >
                    Return to Previous Page
                </Button>
            </Flex>
        </Flex>
    )
}


export { NotFound };