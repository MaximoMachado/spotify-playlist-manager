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
                    background='#EBF8FF'
                    padding='5px'
                    paddingLeft='15px'
                    paddingRight='15px'
                    overflow='hidden'
                    whiteSpace='nowrap'
                >
                    <Avatar
                        name={username}
                        src={imgUrl}
                    />
                    {isMenuButton && 
                        <Icon 
                            viewBox="0 0 1024 1024" 
                            width='35px' 
                            height='35px'
                            marginLeft='10px'
                            color='black'
                        >
                            <path
                                fill='currentColor'
                                d="M512 64q26 0 54 4l16 46 10 31 32 9q32 10 62 26l29 15 29-15 43-21q44 34 78 77l-22 43-14 30 15 29q15 30 26 62l9 31 31 11 46 15q4 29 4 54v1q0 26-4 54l-46 16-31 10-10 32q-9 32-25 62l-16 29 15 29 22 43q-18 23-36 42h-1q-18 18-41 36l-43-22-29-15-29 16q-30 15-62 25l-32 10-10 31-15 46q-29 4-55 4t-55-4l-15-46-10-31-32-10q-33-10-62-25l-29-16-29 15-43 22q-23-18-42-36-18-19-36-42l22-43 15-29-16-29q-16-31-25-62l-10-32-31-10-46-15q-4-29-4-55t4-55l46-15 31-10 9-32q10-32 26-62l15-29-14-29-22-43q34-44 77-78l44 22 29 15 29-16q30-15 62-26l32-9 10-31 15-46q30-4 55-4zm0-64q-37 0-81 7l-22 4-28 83q-39 12-73 30l-78-39-18 13q-66 48-115 114l-13 18 40 78q-19 36-31 73l-83 28-3 22q-7 44-7 81t7 81l3 22 83 28q12 38 31 73l-39 78 13 18q24 34 52 62 26 26 62 52l18 13 78-39q36 19 73 30l28 84 22 3q44 7 81 7t81-7l22-3 27-84q38-11 74-30l78 39 18-13q35-26 62-52 27-27 52-62l13-18-39-79q18-35 30-73l83-27 4-22q7-44 7-81t-7-81l-4-22-83-28q-12-38-30-73l39-78-13-18q-49-67-115-115l-18-13-78 39q-35-18-73-30l-27-83-22-3q-44-7-81-7zm0 386q52 0 89 37t37 89-37 89-89 37-89-37-37-89 37-89 89-37zm0-64q-79 0-134.5 55.5T322 512t55.5 134.5T512 702t134.5-55.5T702 512t-55.5-134.5T512 322z"
                            />
                        </Icon>
                    }
                    
                </Flex>
            </Box>
        </Tooltip>
    )
}

export {SpotifyAvatar};