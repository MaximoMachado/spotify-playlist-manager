import {useEffect, useState} from 'react';
import { Card } from '../Card/Card';

function Track({ track, topRight, fullInfo=false, ...style }) {
    /**
     * Track Card
     * Props:
     * track {obj}: Spotify Track Object
     * topRight {ReactComponent}: Component to render in top right of Card
     * fullInfo {boolean}: Whether or not to display extra information
     */

    const [artists, setArtists] = useState('');
    const [asideText, setAsideText] = useState('');
    const [externalUrl, setExternalUrl] = useState('');

    useEffect(() => {
        // External Url
        if (track.external_urls !== undefined) {
            setExternalUrl(track.external_urls.spotify);
        }

        // Aside Text
        let text = '';
        text += track.album.name;

        const length = Math.floor(track.duration_ms / 1000);
        const minutes = Math.floor(length / 60).toString();
        const seconds = (length % 60).toString();
        
        text += ` | ${minutes}:${seconds}`
        setAsideText(text);

        // Artists
        setArtists(track.artists.map(artist => artist.name).join(', '))
    }, [track])

    return (
        <Card 
            headerText={track.name}
            externalUrl={externalUrl}
            description={artists}
            asideText={asideText}
            images={track.album.images}
            topRight={topRight}
            fullInfo
            {...style}
        />
    )
}

export {Track};