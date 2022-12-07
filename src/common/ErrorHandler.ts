/* eslint-disable @typescript-eslint/no-explicit-any */
import {Response} from '@loopback/rest';

export const ErrorHandler = (response: Response, err: any): Response => {
  if (err.name === 'MongoError' && err?.code === 11000) {
    return response.status(400).send({error: "Index DB error", detail: err.message, });
  }
  return response.status(500).send({error: "Unhandled error"});
}
