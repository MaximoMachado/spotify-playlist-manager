import { useHistory } from 'react-router-dom';
import { useToast, Flex, Heading, Menu, MenuButton, MenuList, MenuItem, useDisclosure } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import {SpotifyAvatar} from '../SpotifyAvatar/SpotifyAvatar';
import { Settings } from '../Settings/Settings';
import axios from 'axios';

function Header({ ...style }) {

    const toast = useToast();
    const history = useHistory();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleLogout = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/auth/logout`, { withCredentials: true })
            .then(res => {
                history.push('/');
                toast({
                    title: 'Sucessfully logged out.',
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                });
            })
            .catch(err => {
                console.error(err);
                toast({
                    title: 'Something went wrong with logging out.',
                    description: 'Please wait a bit and then try again.',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });
            })
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