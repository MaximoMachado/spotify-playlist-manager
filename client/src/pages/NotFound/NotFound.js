import { Flex, Spacer, Heading, Text, Button } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import {PageLayout} from '../../components/PageLayout/PageLayout';

function NotFound() {
    let history = useHistory();

    const handleReturn = () => {

        if (history.length >= 1) {
            history.goBack();
        } else {
            history.push('/');
        }

    }

    return (
        <PageLayout>
            <Flex direction='column' align='center' height='25%'>
                <Heading align='center'>Error 404</Heading>
                <Text align='center'>Sorry! The page you were looking for doesn't exist.</Text>

                <Spacer />
                <Button
                    boxShadow='md'
                    onClick={handleReturn}
                >
                    Return to Previous Page
                </Button>
            </Flex>
        </PageLayout>
    )
}


export { NotFound };