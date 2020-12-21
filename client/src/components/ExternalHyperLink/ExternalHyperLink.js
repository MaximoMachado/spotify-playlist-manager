import {Link} from '@chakra-ui/react';

function ExternalHyperLink({ children, href, ...style }) {
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