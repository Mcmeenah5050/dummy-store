import { useEffect, useState } from "react";

export default function useFetch(endpoint, params1, params2) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await endpoint(params1, params2, { signal });
        if (!signal.aborted) {
          setData(res.data);
        }
      } catch (error) {
        if (!signal.aborted) {
          console.log(error);
          setError(
            error && error.response.data.message
              ? error.response.data.message
              : error.message
          );
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      controller.abort();
    };
  }, [endpoint, params1, params2]);

  return { data, error, loading, setData };
}
