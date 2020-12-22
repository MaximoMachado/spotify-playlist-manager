import { Flex, Heading } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import {SpotifyAvatar} from '../SpotifyAvatar/SpotifyAvatar';

function Header() {
    return (
        <Flex 
            justifyContent='space-between'
            paddingLeft='20px'
            paddingRight='20px'
            alignItems='center'
            color='#1DB954'
            textDecoration='underline'
            textAlign='center'
        >
            <Heading as={NavLink} to='/'>Spotify Playlist Manager</Heading>
            <SpotifyAvatar />
        </Flex>
    )
}

export {Header};