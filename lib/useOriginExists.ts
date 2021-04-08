import useSWR from 'swr';

const fetcher = async (uri: string) => {
  const response = await fetch(uri);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result;
};

export function useOriginExists(origin: string, skip = false) {
  const { data, error, isValidating } = useSWR(`/api/exists?origin=${origin}`, fetcher, {
    isPaused: () => skip,
  });

  return { exists: data?.exists, error, loading: !skip && isValidating };
}
