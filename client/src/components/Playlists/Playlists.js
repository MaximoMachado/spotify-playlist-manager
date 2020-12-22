import {useState, useEffect} from 'react';
import {StyledVStack} from '../StyledVStack/StyledVStack';
import { Playlist } from '../Playlist/Playlist';

function Playlists({ playlists, fullInfo=false, ...style}) {

    const [playlistCards, setPlaylistCards] = useState([]);

    useEffect(() => {
        setPlaylistCards(playlists.map(playlistData => {
            return <Playlist 
                key={playlistData.uri}
                playlist={playlistData}
                fullInfo
            />;
        }))
    }, [playlists])

    return (
        <StyledVStack {...style}>
            {playlistCards}
        </StyledVStack>
    )
}

export {Playlists};