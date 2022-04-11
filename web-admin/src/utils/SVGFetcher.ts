const SVGFetcher = async (url: string, query: string) => {
  fetch(url)
    .then((res) => res.text())
    .then((svg) => {
      if (document.querySelector(query)?.innerHTML === "") {
        document.querySelector(query)?.insertAdjacentHTML("afterbegin", svg);
      }
    });
};

export default SVGFetcher;
