import { useHistory } from 'react-router-dom';
import { Flex, Heading, Menu, MenuButton, MenuList, MenuItem, useDisclosure } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import {SpotifyAvatar} from '../SpotifyAvatar/SpotifyAvatar';
import { Settings } from '../Settings/Settings';

function Header({ ...style }) {

    const history = useHistory();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleLogout = () => {
        history.push('/');
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
            <Menu isLazy>
                <SpotifyAvatar 
                    as={MenuButton}
                    isMenuButton
                    aria-label="User Menu"
                />
                <MenuList>
                    <MenuItem
                        onClick={onOpen}
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
            <Settings isOpen={isOpen} onClose={onClose}/>
        </Flex>
    )
}

export {Header};