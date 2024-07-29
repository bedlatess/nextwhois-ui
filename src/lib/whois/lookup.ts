import { MAX_WHOIS_FOLLOW } from "@/lib/env";
import whois from "whois-raw";
import { WhoisResult } from "@/lib/whois/types";
import { parseWhoisData } from "@/lib/whois/tld_parser";
import {countDuration, toErrorMessage} from "@/lib/utils";


const lookupOptions = {
  follow: MAX_WHOIS_FOLLOW,
};


export function getLookupRawWhois(domain: string, options?: any): Promise<string> {
  return new Promise((resolve, reject) => {
    whois.lookup(domain, options, (err: Error, data: string) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
export async function lookupWhois(domain: string): Promise<WhoisResult> {
  const startTime = Date.now();

  try {
    const data = await getLookupRawWhois(domain, lookupOptions);
    const endTime = Date.now();
    const parsed = parseWhoisData(data, domain);

    return {
      status: true,
      time: countDuration(startTime, endTime),
      result: parsed,
    };
  }

  catch (e) {
    return {
      status: false,
      time: countDuration(startTime),
      error: toErrorMessage(e),
    };
  }
}
