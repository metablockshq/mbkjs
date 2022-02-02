import { useState, useEffect } from "react";
import useSWR from "swr";

import { random } from "@kyra/utils/string";

// observe defAtom state changes
const useAtom = (atom) => {
  const id = random();
  const [state, setState] = useState(atom.deref());

  useEffect(() => {
    // add a watcher with this id
    atom.addWatch(id, (_, _previous, current) => {
      setState(current);
    });

    return () => {
      // remove watcher when component unmounts
      atom.removeWatch(id);
    };
  }, []);

  // should we expose id?
  return state;
};

// https://github.com/siddharthkp/use-timeout
const useTimeout = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setTimeout(tick, delay);
      return () => clearTimeout(id);
    }
  }, [delay]);
};

// https://github.com/donavon/use-interval
const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (...args) => savedCallback.current(...args);

    if (delay !== null) {
      const id = setInterval(handler, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const useResource = (url) => {
  const { data, error } = useSWR(url);
  const isLoading = !data && !error;
  return { data, error, isLoading };
};

// https://stackoverflow.com/questions/34424845/adding-script-tag-to-react-jsx
const useScript = (url) =>
  useEffect(() => {
    const script = document.createElement("script");

    script.src = url;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url]);

const useWindowSize = () => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
};

export {
  useResource,
  useInterval,
  useTimeout,
  useAtom,
  useScript,
  useWindowSize,
};
