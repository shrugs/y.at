export async function doesOriginExist(origin: string): Promise<boolean> {
  return true;
}

export async function setIfNotExists(origin: string, destination: string): Promise<void> {
  return;
}

export async function getDestinationIfExists(origin: string): Promise<string> {
  return 'https://google.com';
}
