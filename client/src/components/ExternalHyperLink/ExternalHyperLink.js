import {Link} from '@chakra-ui/react';

function ExternalHyperLink({ children, href, ...style }) {
    /**
     * Styled HyperLink to some external website
     * Props:
     * href {str}: Link to external website
     * children {ReactComponents}: Component to act as link
     */

    return (
        <Link
            color='blue.400'
            textDecoration='underline'
            _hover={{ textDecoration: 'none', color: 'blue.700' }}
            href={href}
            isExternal
            {...style}
        >
            {children}
        </Link>
    )
}

export {ExternalHyperLink};