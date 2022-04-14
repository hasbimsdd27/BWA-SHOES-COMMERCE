interface IPropsPagination {
  currentPage: number;
  totalPage: number;
  onClick: (page: number) => void;
  totalData: number;
}

function Pagination({
  currentPage,
  totalPage,
  totalData,
  onClick,
}: IPropsPagination) {
  let pages: string[] = [];

  if (totalPage <= 5) {
    for (let i = 1; i <= totalPage; i++) {
      pages.push(String(i));
    }
  }

  return (
    <div className="flex flex-row items-center">
      <div className="flex flex-1 justify-start">
        <div
          className="mx-2 cursor-pointer"
          onClick={() => {
            if (currentPage !== 1) {
              onClick(currentPage - 1);
            }
          }}
        >
          <span className="text-3xl"> &lsaquo;</span>
        </div>
        {pages.map((item, index) => (
          <div
            onClick={() => {
              onClick(Number(item));
            }}
            key={index}
            className={[
              "flex items-center justify-center cursor-pointer px-2 py-1 mx-1 rounded-md",
              Number(item) === currentPage
                ? "bg-app-primary"
                : "hover:bg-app-primary",
            ].join(" ")}
          >
            <span className="">{item}</span>
          </div>
        ))}
        <div
          className="mx-2 cursor-pointer"
          onClick={() => {
            if (currentPage !== totalPage) {
              onClick(currentPage + 1);
            }
          }}
        >
          <span className="text-3xl"> &rsaquo;</span>
        </div>
      </div>
      <div className="flex flex-1 text-xs justify-end">
        <span className="text-right">
          Showing page <b>{currentPage} </b> from <b> {totalPage} </b> pages
          with total <b> {totalData} </b> entries
        </span>
      </div>
    </div>
  );
}

export default Pagination;
