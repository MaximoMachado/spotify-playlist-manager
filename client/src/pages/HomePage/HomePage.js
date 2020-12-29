import { Heading, Text, Button, VStack, Flex } from '@chakra-ui/react';
import { ExternalHyperLink } from '../../components/ExternalHyperLink/ExternalHyperLink';
import { PageLayout } from '../../components/PageLayout/PageLayout';

function HomePage() {
    return (
        <PageLayout padding='0px'>
            <Flex flexDirection='column' margin='auto'>
                <VStack spacing={15}>
                    <Heading textAlign='center'>Spotify Playlist Manager</Heading>
                    <Text textAlign='center'>
                        Tool for power users to manipulate and utilize Spotify playlists in new and unique ways.
                    </Text>
                    <Text textAlign='center' marginBottom='50px'>
                        Some examples include set operations on playlists and truly random playlist shuffling.
                    </Text>
                    <Button
                        as='a'
                        boxShadow='md'
                        border='1px'
                        borderColor='gray.400'
                        marginBottom='50px'
                        href={`${process.env.REACT_APP_API_URL}/auth/login`}
                    >
                        Log In With Spotify
                    </Button>
                    <Text textAlign='center'> 
                        Maximo Machado | maximo@mit.edu | <ExternalHyperLink href='https://github.com/MaximoMachado/spotify-playlist-manager'>Github Repo</ExternalHyperLink>
                    </Text>
                </VStack>
            </Flex>
        </PageLayout>
    );
}

export {HomePage};