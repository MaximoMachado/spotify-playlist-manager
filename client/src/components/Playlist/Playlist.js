import { useState, useEffect } from 'react';
import { Card } from '../Card/Card';

function Playlist({ playlist, topRight, fullInfo=false, ...style}) {
    /**
     * Playlist Card
     * Props:
     * playlist {obj}: Spotify Playlist Object
     * topRight {ReactComponent}: Component to render in top right of Card
     * fullInfo {boolean}: Whether or not to display extra information
     */

    const [asideText, setAsideText] = useState('');
    const [externalUrl, setExternalUrl] = useState('');

    useEffect(() => {
        if (playlist.external_urls !== undefined) {
            setExternalUrl(playlist.external_urls.spotify);
        }

        let text = '';
        if (playlist.owner !== undefined) {
            text += `Created by ${playlist.owner.display_name}`;
        }

        if (playlist.tracks !== undefined) {
            text += ` | ${playlist.tracks.total} Songs`;
        }

        setAsideText(text);
    }, [playlist])

    return (
        <Card
            headerText={playlist.name}
            description={playlist.description}
            asideText={asideText}
            externalUrl={externalUrl}
            images={playlist.images}
            topRight={topRight}
            fullInfo
            {...style}
        />
    );
}

export {Playlist};