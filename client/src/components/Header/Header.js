import { Flex, Heading } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import {SpotifyAvatar} from '../SpotifyAvatar/SpotifyAvatar';

function Header() {
    return (
        <Flex 
            justifyContent='space-between'
            paddingTop='10px'
            paddingLeft='20px'
            paddingRight='20px'
            alignItems='center'
            color='#1DB954'
            textDecoration='underline'
            textAlign='center'
        >
            <Heading as={Link} to='/'>Spotify Playlist Manager</Heading>
            <SpotifyAvatar />
        </Flex>
    )
}

export {Header};