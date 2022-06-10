import { createClient, PostgrestResponse } from '@supabase/supabase-js';
import { SupabaseUniverse, SupabaseWrappedUserNft } from './types';

const SUPABASE_ANON =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxbWx0dm9teWZ2cW5ua3hld3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTQ4NDkxMjksImV4cCI6MTk3MDQyNTEyOX0.f2NfRdjpNH9E0JN-Vwn094pFZSQ61wM0G6r8EZYX_7w';
const SUPABASE_URL = 'https://vqmltvomyfvqnnkxewqq.supabase.co';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

const supabaseClient = {
  /**
   *
   * @returns Get all wrapped user NFTs
   */
  getAllWrappedUserNfts: async () => {
    try {
      const { data, error }: PostgrestResponse<SupabaseWrappedUserNft> =
        await supabase.from('wrapped_user_nft').select();

      if (error && error.message) {
        //throw Error(error.message);
        console.log(error);
      }
      return data;
    } catch (err) {
      throw err;
    }
  },

  /**
   *
   * @returns Get all Universes
   */
  getAllUniverses: async () => {
    try {
      const { data, error }: PostgrestResponse<SupabaseUniverse> =
        await supabase.from('universe').select();

      if (error && error.message) {
        //throw new Error(error.message);
        console.log(error);
      }

      return data;
    } catch (err) {
      throw err;
    }
  },

  /**
   *
   * @param wallet - user's wallet address in string
   * @returns all wrapped user nfts of an user
   */
  getWrappedUserNfts: async (wallet: string, universe: string) => {
    try {
      const { data, error }: PostgrestResponse<SupabaseWrappedUserNft> =
        await supabase
          .from('wrapped_user_nft')
          .select()
          .eq('nft_authority', wallet)
          .eq('universe', universe);

      if (error && error.message) {
        //throw Error(error.message);
        console.log(error);
      }
      return data;
    } catch (err) {
      throw err;
    }
  },

  /**
   *
   * @param wallet - user's wallet address in string
   * @returns universes created by user(any wallet)
   */
  getUniverses: async (wallet: string) => {
    try {
      const { data, error }: PostgrestResponse<SupabaseUniverse> =
        await supabase.from('universe').select().eq('authority', wallet);

      if (error && error.message) {
        //throw new Error(error.message);
        console.log(error);
      }

      return data;
    } catch (err) {
      throw err;
    }
  },
};

export { supabaseClient };
