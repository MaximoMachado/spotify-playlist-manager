import './HomePage.css';
import { Link, Flex, Spacer, Heading, Text, Button } from '@chakra-ui/react';
import {useHistory} from 'react-router-dom';

function HomePage() {
    let history = useHistory();

    return (
        <Flex
            direction='column'
            justify='center'
            align='center'
            width='100vw' 
            height='100vh'
            background='#EBF8FF'
        >
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
                    onClick={() => history.goBack()}
                >
                    Log In With Spotify
                </Button>
            </Flex>
            <Text marginTop='auto' paddingBottom='1em' align='center'> 
                Maximo Machado | maximo@mit.edu | <Link textDecoration='underline' isExternal href='https://github.com/MaximoMachado/spotify-playlist-manager'>Github Repo</Link> 
            </Text>
        </Flex>
    );
}

export {HomePage};