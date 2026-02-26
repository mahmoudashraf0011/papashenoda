import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSayingsPhotoAction, getAllSayingsWrittenAction } from '../../../../redux/actions/Media/Writings/SayingsActions';

const inFlight = {
  written: null, 
  photo: null,   
};

export default function SayingsHook() {
  const dispatch = useDispatch();

  const resX = useSelector(state => state.SayingsReducer.sayingsWritenData);
  const resY = useSelector(state => state.SayingsReducer.sayingsPhotoData);

  useEffect(() => {
    // Determine whether we should fetch based on store presence
    const shouldFetchWritten = !resX?.data;
    const shouldFetchPhoto = !resY?.data;

    if (!shouldFetchWritten && !shouldFetchPhoto) {
      return;
    }

    const getData = async () => {
      // WRITTEN: if needed, start or reuse the in-flight promise
      if (shouldFetchWritten) {
        if (inFlight.written) {
          console.info('[SayingsHook] reusing in-flight written promise');
          try {
            await inFlight.written;
          } catch (e) {
            
          }
        } else {
          console.info('[SayingsHook] starting written fetch and storing promise');
          // set promise before dispatch to avoid race
          const p = (async () => {
            try {
              // dispatch returns the thunk result (promise)
              return await dispatch(getAllSayingsWrittenAction(4, 1));
            } finally {
              // clear after settle so future calls can retry if needed
              inFlight.written = null;
            }
          })();
          inFlight.written = p;
          try {
            await p;
          } catch (e) {
            // error already handled by thunk; just log optionally
            console.error('[SayingsHook] written fetch error', e);
          }
        }
      }

      // PHOTO: same pattern but separate slot
      if (shouldFetchPhoto) {
        if (inFlight.photo) {
          console.info('[SayingsHook] reusing in-flight photo promise');
          try {
            await inFlight.photo;
          } catch (e) {
            // swallow
          }
        } else {
          console.info('[SayingsHook] starting photo fetch and storing promise');
          const p = (async () => {
            try {
              return await dispatch(getAllSayingsPhotoAction(8, 1));
            } finally {
              inFlight.photo = null;
            }
          })();
          inFlight.photo = p;
          try {
            await p;
          } catch (e) {
            console.error('[SayingsHook] photo fetch error', e);
          }
        }
      }
    };

    // fire-and-forget inside effect is fine since we handle errors/logs
    getData();
  }, [dispatch, resX?.data, resY?.data]);

  let sayingsWrittenDataLimited = [];
  try {
    if (resX?.data) {
      sayingsWrittenDataLimited.push(resX.data);
    }
  } catch (e) {
    console.log(e);
  }

  let sayingsPhotoDataLimited = [];
  try {
    if (resY?.data) {
      sayingsPhotoDataLimited.push(resY.data);
    }
  } catch (e) {
    console.log(e);
  }

  return [sayingsWrittenDataLimited, sayingsPhotoDataLimited];
}
