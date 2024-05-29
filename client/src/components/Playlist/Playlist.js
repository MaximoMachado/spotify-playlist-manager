import { Card } from '../Card/Card';

function Playlist({ playlist, topRight, fullInfo=false, ...style}) {
    /**
     * Playlist Card
     * Props:
     * playlist {obj}: Spotify Playlist Object
     * topRight {ReactComponent}: Component to render in top right of Card
     * fullInfo {boolean}: Whether or not to display extra information
     */

    const externalUrl = (playlist.external_urls !== undefined) ? playlist.external_urls : '';

    let asideText = '';
    if (playlist.owner !== undefined) {
        asideText += `Created by ${playlist.owner.display_name}`;
    }

    if (playlist.tracks !== undefined) {
        if (asideText.length > 0) {
            asideText += ' | ';
        }
        asideText += `${playlist.tracks.total} Songs`;
    }

    return (
        <Card
            headerText={playlist.name}
            description={playlist.description}
            asideText={asideText}
            externalUrl={externalUrl}
            images={playlist.images}
            topRight={topRight}
            fullInfo={fullInfo}
            {...style}
        />
    );
}

export {Playlist};