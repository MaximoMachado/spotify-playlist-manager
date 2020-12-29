import { Flex, Heading } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import {SpotifyAvatar} from '../SpotifyAvatar/SpotifyAvatar';

function Header({ ...style }) {
    return (
        <Flex 
            justifyContent='space-between'
            alignItems='center'
            color='#1DB954'
            textDecoration='underline'
            textAlign='center'
            {...style}
        >
            <Heading as={Link} to='/'>Spotify Playlist Manager</Heading>
            <SpotifyAvatar />
        </Flex>
    )
}

export {Header};