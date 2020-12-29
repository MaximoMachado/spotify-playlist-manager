import { useState, useEffect } from 'react';
import { Avatar, Tooltip } from '@chakra-ui/react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function SpotifyAvatar({ isMenuButton=false, ...style }) {
    /**
     * Gets the current user's profile picture and displays it
     * Props:
     * isMenuButton {boolean}: When true, displays tooltip that says "User Settings"
     */

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
                if (err.response.status === 401) history.push('/');
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