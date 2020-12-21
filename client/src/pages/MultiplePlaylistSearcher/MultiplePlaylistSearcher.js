import {useEffect, useState} from 'react';
import axios from 'axios';
import {PageLayout} from '../../components/PageLayout/PageLayout';
import { Playlists } from '../../components/Playlists/Playlists';

function MultiplePlaylistSearcher() {

    const [playlists, setPlaylists] = useState({});

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/spotify/getUserPlaylists`, { withCredentials: true })
            .then(data => setPlaylists(data))
            .catch(err => console.error(err))
    }, [])

    return (
        <PageLayout height='100%' width='100%'>
            <Playlists playlists={playlists}/>
        </PageLayout>
    )
}

export {MultiplePlaylistSearcher};