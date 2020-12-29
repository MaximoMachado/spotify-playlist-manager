import { useState, useEffect } from 'react';
import { Avatar, Tooltip, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function SpotifyAvatar({ isMenuButton=false, ...style }) {
    /**
     * Gets the current user's profile picture and displays it
     * Props:
     * isMenuButton {boolean}: When true, displays tooltip that says "User Settings"
     */

    const toast = useToast();
    let history = useHistory();
    const [username, setUsername] = useState('');
    const [imgUrl, setImgUrl] = useState('');

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/spotify/getMe`, { withCredentials: true })
            .then(res => {
                const user = res.data.body;
                
                setUsername(user.display_name);

                if (user.images.length > 0) {
                    setImgUrl(user.images[0].url);
                } else {
                    setImgUrl('');
                }
                
            })
            .catch(err => {
                console.error(err);
                if (err.response.status === 401) {
                    history.push('/');
                    toast({
                        title: 'Please login first and try again.',
                        status: 'warning',
                        duration: 9000,
                        isClosable: true,
                    });
                } else {
                    toast({
                        title: 'Something went wrong.',
                        description: 'Please wait a bit and then try again.',
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    });
                }
            })
    }, [])

    return (
        <Tooltip
            label='User Settings'
            placement='left'
            fontSize='md'
            hasArrow
            isDisabled={!isMenuButton}
        >
            <Avatar
                name={username}
                src={imgUrl}
                shadow='dark-lg'
                {...style}
            />
        </Tooltip>
    )
}

export {SpotifyAvatar};