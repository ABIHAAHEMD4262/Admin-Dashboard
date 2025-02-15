import { createClient } from '@sanity/client';
import {dataset, projectId, token} from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-02-01', // Latest API version use karo
  token, // Ensure ye correct hai
  useCdn: false, // CDN ko disable kar do for write operations
});
