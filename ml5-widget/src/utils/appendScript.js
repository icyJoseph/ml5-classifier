export const appendScript = ({ src, onError, onLoad }) => {
  const scripts = [...document.scripts].map(({ src }) => src);

  if (scripts.includes(src)) {
    onLoad();
    return () => {};
  }

  let timer = setTimeout(() => {
    const script = document.createElement("script");
    document.body.appendChild(script);
    script.onload = onLoad;
    script.onerror = onError;
    script.async = true;
    script.src = src;
  }, 0);

  return () => clearTimeout(timer);
};
