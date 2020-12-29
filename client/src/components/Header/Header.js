import { Flex, Heading, Menu, MenuButton, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import {SpotifyAvatar} from '../SpotifyAvatar/SpotifyAvatar';

function Header({ ...style }) {
    return (
        <Flex 
            justifyContent='space-between'
            alignItems='center'
            {...style}
        >
            <Heading 
                as={Link} 
                to='/'
                color='#1DB954'
                textDecoration='underline'
                textAlign='center'
                _hover={{ textDecoration: 'none', color: 'green.700' }}
            >
                Spotify Playlist Manager
            </Heading>
            <Flex>
                <SpotifyAvatar />
                <Menu>
                    <MenuButton as={Button}>Settings</MenuButton>
                </Menu>
            </Flex>
        </Flex>
    )
}

export {Header};