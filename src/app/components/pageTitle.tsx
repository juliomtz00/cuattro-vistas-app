import NextLink from 'next/link'; // actual link component
import React from 'react';

interface PageTitleProps {
  title?: string;
  href?: string;
  linkCaption?: string;
}

const PageTitle = ({ title, href, linkCaption }: PageTitleProps) => {
  return (
    <div className="p-4 bg-secondary shadow-md mb-3 flex justify-between items-center">
      <h1 className="text-white font-bold text- text-xl">{title}</h1>
      {href && (
        <NextLink href={href} className="flex items-center gap-2 text-white hover:text-gray-400 transition-colors font-medium">          
            {linkCaption}
        </NextLink>
      )}
    </div>
  );
};

export default PageTitle;
