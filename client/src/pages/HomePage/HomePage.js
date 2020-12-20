import { Flex, Spacer, Heading, Text, Button } from '@chakra-ui/react';
import { ExternalHyperLink } from '../../components/ExternalHyperLink/ExternalHyperLink';
import { PageLayout } from '../../components/PageLayout/PageLayout';

function HomePage() {
    return (
        <PageLayout>
            <Text visibility='hidden' marginBottom='auto' align='center'></Text>
            <Flex direction='column' align='center' height='25%'>
                <Heading align='center'>Spotify Playlist Manager</Heading>
                <Spacer />
                <Text align='center'>Tool for power users to manipulate and utilize Spotify playlists in new and unique ways.</Text>
                <Spacer />
                <Text align='center'>Some examples include set operations on playlists and truly random playlist shuffling.</Text>
                <Spacer />
                <Button
                    as='a'
                    boxShadow='md'
                    href={`${process.env.REACT_APP_API_URL}/auth/login`}
                >
                    Log In With Spotify
                </Button>
            </Flex>
            <Text marginTop='auto' paddingBottom='1em' align='center'> 
                Maximo Machado | maximo@mit.edu | <ExternalHyperLink href='https://github.com/MaximoMachado/spotify-playlist-manager'>Github Repo</ExternalHyperLink>
            </Text>
        </PageLayout>
    );
}

export {HomePage};