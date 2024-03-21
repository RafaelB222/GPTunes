import { useState } from 'react';

const usePagination = (items, itemsPerPage, isMobile, initialPage, maxButtons) => {
  if (isMobile) {
    maxButtons = 3;
  }

  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const canGoNextPage = currentPage != totalPages && totalPages != 0;

  const startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxButtons - 1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, items.length - 1);

  const visibleItems = items.slice(startIndex, endIndex + 1);

  const getPageButtonProps = (page) => ({
    className: `font-semibold py-2 px-4 border transition duration-300 ease-in-out focus:outline-none ${
      currentPage === page
        ? 'bg-themeMidBlue text-themePalePink cursor-not-allowed border-themeMidBlue'
        : 'bg-white text-gray-500 border-themeMidBlue hover:bg-gray-200'
    }`,
    onClick: () => setCurrentPage(page),
    key: page,
  });

  const pageButtons = [];

  for (let page = startPage; page <= endPage; page++) {
    pageButtons.push(getPageButtonProps(page));
  }

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    visibleItems,
    canGoNextPage,
    pageButtons,
  };
};

export default usePagination;
