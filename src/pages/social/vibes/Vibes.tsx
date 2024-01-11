import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import Suggestions from '@components/suggestions/Suggestions';
import { getUserSuggestions } from '@redux-toolkit/api/suggestion';

import '@pages/social/vibes/Vibes.scss';
import useEffectOnce from '@hooks/useEffectOnce';
import { PayloadAction, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '@redux-toolkit/store';

const Vibes = () => {
  const bodyRef = useRef(null);
  const bottomLineRef = useRef(null);
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, PayloadAction>>();

  useEffectOnce(() => {
    dispatch(getUserSuggestions());
  });

  return (
    <div className="vibes">
      <div className="vibes-content">
        <div className="vibes-post" ref={bodyRef}>
          <div>Post Form</div>
          <div>Post Items</div>
          <div ref={bottomLineRef} style={{ marginBottom: '50px', height: '50px' }}></div>
        </div>
        <div className="vibes-suggestions">
          <Suggestions />
        </div>
      </div>
    </div>
  );
};

export default Vibes;
