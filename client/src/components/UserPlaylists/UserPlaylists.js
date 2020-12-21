import {useState, useEffect} from 'react';
import axios from 'axios';
import {StyledVStack} from '../../components/StyledVStack/StyledVStack';
import { Playlist } from '../../components/Playlist/Playlist';

function UserPlaylists({ fullInfo=true, ...style}) {

    const [playlistCards, setPlaylistCards] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/spotify/getUserPlaylists`, { withCredentials: true })
            .then(data => {
                const items = data.data.body.items;
                

                setPlaylistCards(items.map(playlistData => {
                    return <Playlist 
                        key={playlistData.uri}
                        playlistData={playlistData}
                    />;
                }))
            })
            .catch(err => console.error(err))
    }, [])

    return (
        <StyledVStack {...style}>
            {playlistCards}
        </StyledVStack>
    )
}

export {UserPlaylists};