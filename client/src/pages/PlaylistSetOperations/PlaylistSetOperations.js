import { useMediaQuery, HStack, Flex } from '@chakra-ui/react';
import { PageLayout } from "../../components/PageLayout/PageLayout";

function PlaylistSetOperations() {

    const [largerThan48Em] = useMediaQuery('(min-width: 48em) ');
    
    return (
        <PageLayout showHeader>
            <HStack>
                <Flex>

                </Flex>
                <Flex>

                </Flex>
            </HStack>
        </PageLayout>
    )
}

export {PlaylistSetOperations};