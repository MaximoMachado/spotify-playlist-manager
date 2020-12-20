import {useState, useEffect} from 'react';
import axios from 'axios';
import {PageLayout} from '../../components/PageLayout/PageLayout';
import {StyledVStack} from '../../components/StyledVStack/StyledVStack';
import { Playlist } from '../../components/Playlist/Playlist';

function MultiplePlaylistSearcher() {

    const [playlistCards, setPlaylistCards] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/spotify/getUserPlaylists`, { withCredentials: true })
            .then(data => {
                const items = data.data.body.items;
                

                setPlaylistCards(items.map(playlistData => {
                    console.log(playlistData)
                    return <Playlist 
                        key={playlistData.uri}
                        playlistData={playlistData}
                    />;
                }))
            })
            .catch(err => console.error(err))
    }, [])

    return (
        <PageLayout height='100%' width='100%'>
            <StyledVStack>
                {playlistCards}
            </StyledVStack>
        </PageLayout>
    )
}

export {MultiplePlaylistSearcher};