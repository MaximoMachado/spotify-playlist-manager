import { useState } from 'react';
import { history, useHistory } from 'react-router-dom';
import { Flex, Heading, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import {SpotifyAvatar} from '../SpotifyAvatar/SpotifyAvatar';

function Header({ ...style }) {

    const history = useHistory();
    const [settingsOpen, setSettingsOpen] = useState(false);

    const handleLogout = () => {

    }

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
            <Menu>
                <SpotifyAvatar 
                    as={MenuButton}
                    isMenuButton
                    aria-label="User Menu"
                />
                <MenuList>
                    <MenuItem
                        onClick={() => setSettingsOpen(true)}
                    >
                        Settings
                    </MenuItem>
                    <MenuItem
                        onClick={() => handleLogout()}
                    >
                        Logout
                    </MenuItem>
                </MenuList>
            </Menu>
        </Flex>
    )
}

export {Header};