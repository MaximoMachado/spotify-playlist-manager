import {useState, useEffect} from 'react';
import {StyledVStack} from '../StyledVStack/StyledVStack';
import { Playlist } from '../Playlist/Playlist';

function Playlists({ playlists, createTopRight=null, fullInfo=false, ...style}) {
    /**
     * Vertical Stack of Playlist Cards
     * Props:
     * playlists {array}: Array of Spotify Playlist Objects
     * createTopRight {func}: Function that recieves each playlist data that returns a React Component
     * fullInfo {boolean}: Whether or not to display extra information
     */

    const [playlistCards, setPlaylistCards] = useState([]);

    useEffect(() => {
        setPlaylistCards(playlists.map(playlistData => {
            return <Playlist 
                key={playlistData.uri}
                playlist={playlistData}
                topRight={(createTopRight !== null) ? createTopRight(playlistData) : null}
                fullInfo={fullInfo}
            />;
        }))
    }, [playlists, createTopRight, fullInfo])

    return (
        <StyledVStack {...style}>
            {playlistCards}
        </StyledVStack>
    )
}

export {Playlists};