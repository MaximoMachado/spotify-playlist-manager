import { useState } from 'react';
import axios from 'axios';
import {PageLayout} from '../../components/PageLayout/PageLayout';
import { Playlists } from '../../components/Playlists/Playlists';
import {Search} from '../../components/Search/Search';
import { Track } from '../../components/Track/Track';
import { Button, CircularProgress, Heading, VStack, useToast } from '@chakra-ui/react';

function MultiplePlaylistSearcher() {

    const toast = useToast();

    const [song, setSong] = useState({});
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(false);

    const checkPlaylistsForSong = (item) => {
        setLoading(true);

        const { uri } = item;
        setSong(item);
        axios.get(`${process.env.REACT_APP_API_URL}/tools/multiple-playlist-searcher/${uri}`, { withCredentials: true })
            .then(res => {
                if (res.data.length > 0) {
                    setPlaylists(res.data);
                } else {
                    toast({
                        position: 'top',
                        title: 'Song is not in any of your playlists.',
                        description: 'Try searching another song.',
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                    });
                }
                setLoading(false);
            })
            .catch(err => console.error(err))
    };

    const handleNewSearch = () => {
        setPlaylists([]);
        setSong({});
    }

    return (
        <PageLayout 
            height='100%'
            minHeight='100vh'
            width='100%'
            minWidth='100vw'
        >
            {(!loading && playlists.length === 0 ) && <Search 
                searchUrl={`${process.env.REACT_APP_API_URL}/spotify/searchTracks`}
                createComponents={res => {
                    const { items } = res.data.body.tracks;
                    return items.map(item => {
                        return <Track 
                                key={item.uri} 
                                track={item} 
                                fullInfo
                                topRight={<Button onClick={() => checkPlaylistsForSong(item)}>Find Playlists</Button>}
                            />;
                    });
                }}
                height={['100%', '75%', '50%', '50%']}
                width={['100%', '75%', '50%', '50%']}
            />}
            {(!loading && playlists.length > 0) &&
                <VStack >
                    <Heading textAlign='center'>Playlists Containing {song.name} by {song.artists[0].name}</Heading>
                    <Playlists playlists={playlists} fullInfo/>
                    <Button 
                        boxShadow='md'
                        onClick={handleNewSearch}
                    >
                        Search For Another Song
                    </Button>
                </VStack>
            }
            {loading && <CircularProgress isIndeterminate color='green.300'/>}
        </PageLayout>
    )
}

export {MultiplePlaylistSearcher};