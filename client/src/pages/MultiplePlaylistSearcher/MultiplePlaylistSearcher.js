import { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import {PageLayout} from '../../components/PageLayout/PageLayout';
import { Playlists } from '../../components/Playlists/Playlists';
import {Search} from '../../components/Search/Search';
import { Track } from '../../components/Track/Track';
import { Button, CircularProgress, Heading, VStack, useToast } from '@chakra-ui/react';

function MultiplePlaylistSearcher() {

    const toast = useToast();
    const history = useHistory();

    const [song, setSong] = useState({});
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(false);


    const searchForCurrentlyPlayingSong = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/spotify/getMyCurrentPlayingTrack`, { withCredentials: true })
            .then(res => {
                const track = res?.data?.body?.item;
                if (!(track === undefined || track === null)) {
                    // There is a currently playing track, whether paused or unpaused
                    const artists = track.artists;
                    const artist_str = (artists.length > 0) ? ` by ${artists[0].name}` : '';
                    toast({
                        title: `Searching for ${track.name}${artist_str}`,
                        description: '',
                        status: 'success',
                        duration: 4000,
                        isClosable: true,
                    });
                    if (!track.is_local) {
                        checkPlaylistsForSong(track);
                    } else {
                        toast({
                            title: "Spotify's API does not support searching for local songs",
                            description: 'Try searching another song.',
                            status: 'warning',
                            duration: 9000,
                            isClosable: true,
                        });
                    }
                } else {
                    toast({
                        title: 'There is no song currently playing.',
                        description: 'Try searching another song.',
                        status: 'warning',
                        duration: 9000,
                        isClosable: true,
                    });
                }
            })
            .catch(err => {
                console.error(err);
            })
    }

    const checkPlaylistsForSong = (item) => {
        window.scrollTo(0, 0);
        setLoading(true);

        const { uri } = item;
        setSong(item);
        axios.get(`${process.env.REACT_APP_API_URL}/tools/multiple-playlist-searcher/${uri}`, { withCredentials: true })
            .then(res => {
                if (res.data.length > 0) {
                    setPlaylists(res.data);
                } else {
                    toast({
                        title: 'Song is not in any of your playlists.',
                        description: 'Try searching another song.',
                        status: 'success',
                        duration: null,
                        isClosable: true,
                    });
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                if (err.response.status === 401) {
                    history.push('/');
                    toast({
                        title: 'Please login first and try again.',
                        status: 'warning',
                        duration: null,
                        isClosable: true,
                    });
                } else {
                    toast({
                        title: 'Something went wrong.',
                        description: 'Please wait a bit and then try again.',
                        status: 'error',
                        duration: null,
                        isClosable: true,
                    });
                }
            })
    };

    const handleNewSearch = () => {
        window.scrollTo(0, 0);
        setPlaylists([]);
        setSong({});
    }

    return (
        <PageLayout 
            paddingBottom='50px'
            showHeader
            contentStyle={{
                minHeight: (loading) ? '93vh' : '0vh' ,
            }}
        >
            {(!loading && playlists.length === 0 ) && <>
                <Search 
                    searchPlaceholderText='Search for a Song'
                    searchUrl={`${process.env.REACT_APP_API_URL}/spotify/searchTracks`}
                    searchForCurrentlyPlayingSong={searchForCurrentlyPlayingSong}
                    createComponents={res => {
                        const { items } = res.data.body.tracks;

                        if (items.length === 0) {
                            toast({
                                title: 'No Results Found',
                                description: 'Try a different search.',
                                status: 'warning',
                                duration: null,
                                isClosable: true,
                            });
                            return [];
                        }

                        return items.map(item => {
                            return <Track 
                                    key={item.uri} 
                                    track={item} 
                                    fullInfo
                                    topRight={<Button 
                                                minWidth='auto'
                                                backgroundColor='blue.300' 
                                                boxShadow='md' 
                                                border='1px'
                                                borderColor='blue.200'
                                                onClick={() => checkPlaylistsForSong(item)}>
                                                    Find Playlists
                                            </Button>}
                                />;
                        });
                    }}
                    height={['100%', '75%', '50%', '50%']}
                    width={['100%', '75%', '50%', '50%']}
                />
            </>}
            {(!loading && playlists.length > 0) &&
                <VStack width='100%' spacing='25px'>
                    <Heading 
                        width='100%'
                        textAlign='center'
                        overflow='hidden' 
                        textOverflow='ellipsis'
                    >
                        Playlists Containing {song.name} by {song.artists[0].name}
                    </Heading>
                    <Playlists playlists={playlists} fullInfo/>
                    <Button
                        border='1px'
                        borderColor='gray.400'
                        boxShadow='md'
                        onClick={handleNewSearch}
                    >
                        Search For Another Song
                    </Button>
                </VStack>
            }
            {loading && 
                <CircularProgress 
                    margin='auto' 
                    size={['100px', '100px', '50px', '50px']} 
                    isIndeterminate 
                    color='green.300'
                />
            }
        </PageLayout>
    )
}

export {MultiplePlaylistSearcher};