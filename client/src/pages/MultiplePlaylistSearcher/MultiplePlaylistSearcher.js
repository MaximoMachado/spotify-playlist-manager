import {PageLayout} from '../../components/PageLayout/PageLayout';
import { UserPlaylists } from '../../components/UserPlaylists/UserPlaylists';

function MultiplePlaylistSearcher() {

    return (
        <PageLayout height='100%' width='100%'>
            <UserPlaylists/>
        </PageLayout>
    )
}

export {MultiplePlaylistSearcher};