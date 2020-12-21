import {useState, useEffect} from 'react';
import {StyledVStack} from '../StyledVStack/StyledVStack';
import { Playlist } from '../Playlist/Playlist';

function Playlists({ playlists, fullInfo=true, ...style}) {

    const [playlistCards, setPlaylistCards] = useState([]);

    useEffect(() => {
        if (playlists.data !== undefined && playlists.data.body !== undefined) {
            const items = playlists.data.body.items;
            
            setPlaylistCards(items.map(playlistData => {
                return <Playlist 
                    key={playlistData.uri}
                    playlistData={playlistData}
                />;
            }))
        }
    }, [playlists])

    return (
        <StyledVStack {...style}>
            {playlistCards}
        </StyledVStack>
    )
}

export {Playlists};