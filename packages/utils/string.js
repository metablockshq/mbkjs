export const capitalise = (s) => s[0].toUpperCase() + s.substring(1);

export const random = () =>
  // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  Math.random().toString(36).substring(2) + new Date().getTime().toString(36);

export const isEmail = (email) => {
  /* eslint-disable */
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  /* eslint-enable */
  return re.test(String(email).toLowerCase());
};

export const isString = (str) => typeof str === "string";

export const retractMiddle = (string, maxLength) => {
  if (!string) return string;
  if (maxLength < 1) return string;
  if (string.length <= maxLength) return string;
  if (maxLength === 1) return `${string.substring(0, 1)}...`;

  const midpoint = Math.ceil(string.length / 2);
  const toremove = string.length - maxLength;
  const lstrip = Math.ceil(toremove / 2);
  const rstrip = toremove - lstrip;
  return `${string.substring(0, midpoint - lstrip)}...${string.substring(
    midpoint + rstrip
  )}`;
};

export const retractEnd = (str, length) =>
  `${str.substring(0, length)} ${str.length > length ? "..." : ""}`;

export const contains = (haystack, needle) => haystack.indexOf(needle) > -1;

export const queryStringToObj = (queryString) =>
  [...new URLSearchParams(queryString).entries()].reduce((prev, [key, val]) => {
    prev[key] = val;
    return prev;
  }, {});

export const slugify = (s) => s.toLowerCase().replace(/ /g, "-");
