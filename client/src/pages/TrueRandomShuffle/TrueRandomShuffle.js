import { useEffect, useState } from "react";
import { Button, CircularProgress, useToast } from '@chakra-ui/react';
import { PageLayout } from "../../components/PageLayout/PageLayout";
import { Playlists } from '../../components/Playlists/Playlists';
import axios from "axios";
import {useHistory} from 'react-router-dom';

function TrueRandomShuffle() {

    const history = useHistory();
    const toast = useToast();
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/spotify/user-playlists`, { withCredentials: true })
            .then(res => {
                setPlaylists(res.data);
            })
            .catch(err => {
                console.error(err);
                if (err.response.status === 401) history.push('/');
            })
    }, [])

    const handleCreatePlaylist = (playlist) => {
        axios.post(`${process.env.REACT_APP_API_URL}/tools/true-random-shuffle`, { uri: playlist.uri, name: playlist.name }, { withCredentials: true })
            .then(res => {
                toast({
                    title: 'Randomized Playlist Successfully Created.',
                    description: 'Please note local songs are unable to be copied over.',
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                });
            })
            .catch(err => {
                console.error(err);
                toast({
                    title: 'Something went wrong.',
                    description: 'Please wait a bit and then try again.',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });
                if (err.response.status === 401) history.push('/');
            })
    };

    return (
        <PageLayout 
            showHeader
            contentStyle={{
                minHeight: (playlists.length > 0) ? '0vh' : '93vh',
            }}
        >
            {playlists.length > 0 ? 
            <Playlists
                marginBottom='25px'
                fullInfo
                playlists={playlists}
                createTopRight={(playlist) => (<Button
                            minWidth='auto'
                            backgroundColor='blue.300' 
                            boxShadow='md'
                            border='1px'
                            borderColor='blue.200'
                            onClick={() => handleCreatePlaylist(playlist)}
                            >
                            Randomize
                        </Button>)}
            /> :
            <CircularProgress 
                margin='auto' 
                size={['100px', '100px', '50px', '50px']} 
                isIndeterminate 
                color='green.300'
            />}
        </PageLayout>
    );
}

export {TrueRandomShuffle};