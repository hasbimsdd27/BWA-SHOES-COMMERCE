const InputValueSetter = (query: string, value: string) => {
  const element = document.querySelector(query);

  if (!!element) {
    (element as HTMLInputElement).value = value;
  }
};

export default InputValueSetter;
