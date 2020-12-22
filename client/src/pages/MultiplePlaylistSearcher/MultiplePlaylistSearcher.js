import { useState } from 'react';
import axios from 'axios';
import {PageLayout} from '../../components/PageLayout/PageLayout';
import { Playlists } from '../../components/Playlists/Playlists';
import {Search} from '../../components/Search/Search';

function MultiplePlaylistSearcher() {

    const [playlists, setPlaylists] = useState([]);

    const checkPlaylistsForSong = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/tools/multiple-playlist-searcher/spotify:track:26kP0UtIDqVEttFjX92BLA`, { withCredentials: true })
            .then(data => {
                setPlaylists(data.data);
            })
            .catch(err => console.error(err))
    };

    return (
        <PageLayout 
            height='100%'
            minHeight='100vh'
            width='100%'
            minWidth='100vw'
        >
            <Search 
                searchUrl={`${process.env.REACT_APP_API_URL}/spotify/searchTracks`}
            />
            {playlists.length > 0 && <Playlists playlists={playlists} fullInfo/>}
        </PageLayout>
    )
}

export {MultiplePlaylistSearcher};