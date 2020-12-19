import { Link, Flex, Spacer, Heading, Text, Button } from '@chakra-ui/react';
import {useHistory} from 'react-router-dom';
import { PageLayout } from '../../components/PageLayout/PageLayout';

function HomePage() {
    let history = useHistory();

    const repoLink = <Link 
            textDecoration='underline' 
            isExternal 
            href='https://github.com/MaximoMachado/spotify-playlist-manager' 
            _hover={{color: '#A0AEC0', textDecoration: 'none'}}
        >
            Github Repo
        </Link>;

    return (
        <PageLayout>
            <Text visibility='hidden' marginBottom='auto' align='center'></Text>
            <Flex direction='column' align='center' height='25%'>
                <Heading align='center'>Spotify Playlist Manager</Heading>
                <Spacer />
                <Text align='center'>A collection of different tools related to playlist management and creation.</Text>
                <Spacer />
                <Text align='center'>Some examples include checking if a song is in saved playlists and set operations on playlists.</Text>
                <Spacer />
                <Button
                    boxShadow='md'
                    onClick={() => history.push('/tools')}
                >
                    Log In With Spotify
                </Button>
            </Flex>
            <Text marginTop='auto' paddingBottom='1em' align='center'> 
                Maximo Machado | maximo@mit.edu | {repoLink}
            </Text>
        </PageLayout>
    );
}

export {HomePage};