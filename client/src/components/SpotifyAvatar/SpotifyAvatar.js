import { useState, useEffect } from 'react';
import { Avatar, Tooltip, useToast, Flex, Icon, Box, Center } from '@chakra-ui/react';
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
            <Box {...style}>
            <Flex
                alignItems='center'
                backgroundColor='gray.500'
                boxShadow='md'
                padding='5px'
                paddingLeft='15px'
                paddingRight='15px'
                borderRadius='15px'
                overflow='hidden'
                whiteSpace='nowrap'
            >
                <Avatar
                    name={username}
                    src={imgUrl}
                    shadow='dark-lg'
                />
                {isMenuButton && 
                    <Icon 
                        viewBox="0 0 1024 705" 
                        width='25px' 
                        height='25px'
                        marginLeft='10px'
                        color='black'
                    >
                        <path
                            fill='currentColor'
                            d="M192 32q0-13 9.5-22.5T224 0h768q13 0 22.5 9.5T1024 32q0 14-9.5 23T992 64H224q-13 0-22.5-9T192 32zM0 32Q0 18 9.5 9T32 0t22.5 9T64 32q0 13-9.5 22.5T32 64 9.5 54.5 0 32zm192 320q0-14 9.5-23t22.5-9h768q13 0 22.5 9t9.5 23q0 13-9.5 22.5T992 384H224q-13 0-22.5-9.5T192 352zM0 350q0-13 9.5-22.5T32 318t22.5 9.5T64 350q0 14-9.5 23T32 382t-22.5-9T0 350zm192 323q0-13 9.5-22.5T224 641h768q13 0 22.5 9.5t9.5 22.5-9.5 22.5T992 705H224q-13 0-22.5-9.5T192 673zM0 672q0-13 9.5-22.5T32 640t22.5 9.5T64 672t-9.5 22.5T32 704t-22.5-9.5T0 672z"
                        />
                    </Icon>
                }
            </Flex>
            </Box>
        </Tooltip>
    )
}

export {SpotifyAvatar};