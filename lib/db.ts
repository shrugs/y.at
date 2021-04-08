import faunadb, { errors, query as q } from 'faunadb';

const client = new faunadb.Client({ secret: process.env.FAUNA_DB_SECRET });
const COLLECTION = 'yats';
const INDEX = 'destinations_by_origin';

export async function upsertIndex(): Promise<void> {
  await client.query(
    q.If(
      q.IsIndex(q.Index(INDEX)),
      null,
      q.CreateIndex({
        name: INDEX,
        unique: true,
        source: q.Collection(COLLECTION),
        terms: [{ field: ['data', 'origin'] }],
      }),
    ),
  );
}

export async function doesOriginExist(origin: string): Promise<boolean> {
  return await client.query(q.Exists(q.Match(q.Index(INDEX), origin)));
}

export async function setIfNotExists(origin: string, destination: string): Promise<void> {
  return await client.query(q.Create(q.Collection(COLLECTION), { data: { origin, destination } }));
}

export async function getDestinationIfExists(origin: string): Promise<string> {
  try {
    const result = await client.query<{ data: { destination: string } }>(
      q.Get(q.Match(q.Index(INDEX), origin)),
    );
    return result.data.destination;
  } catch (error) {
    if (error instanceof errors.NotFound) {
      return null;
    }

    throw error;
  }
}

export async function getCount(): Promise<number> {
  return await client.query(q.Count(q.Documents(q.Collection(COLLECTION))));
}
