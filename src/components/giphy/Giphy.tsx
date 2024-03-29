import Input from '@components/input/Input';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

import '@components/giphy/Giphy.scss';
import { GiphyUtils } from '@services/utils/giphy-utils.service';
import { useDispatch, useSelector } from 'react-redux';
import { updatePostItem } from '@redux-toolkit/reducers/post/post.reducer';
import { toggleGifModal } from '@redux-toolkit/reducers/modal/modal.reducer';
import { RootState } from '@redux-toolkit/store';
import Spinner from '@components/spinner/Spinner';

const Giphy = () => {
  const { gifModalIsOpen } = useSelector((state: RootState) => state.modal);
  const [gifs, setGifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const selectGif = (gif: string) => {
    dispatch(updatePostItem({ gifUrl: gif, image: '' }));
    dispatch(toggleGifModal(!gifModalIsOpen));
  };
  useEffect(() => {
    GiphyUtils.getTrendingGifs(setGifs, setLoading);
  }, []);
  return (
    <>
      <div className="giphy-container" id="editable" data-testid="giphy-container">
        <div className="giphy-container-picker" style={{ height: '500px' }}>
          <div className="giphy-container-picker-form">
            <FaSearch className="search" />
            <Input
              id="gif"
              name="gif"
              type="text"
              labelText=""
              placeholder="Search Gif"
              className="giphy-container-picker-form-input"
              handleChange={(e) => GiphyUtils.searchGifs(e.target.value, setGifs, setLoading)}
            />
          </div>
          {loading && <Spinner />}
          <ul className="giphy-container-picker-list" data-testid="unorderedList">
            {gifs.map((gif, index) => (
              <li
                className="giphy-container-picker-list-item"
                data-testid="list-item"
                key={index}
                onClick={() => selectGif(gif.images.original.url)}
              >
                <img style={{ width: '470px' }} src={`${gif.images.original.url}`} alt="" />
              </li>
            ))}
          </ul>

          {!gifs && !loading && (
            <ul className="giphy-container-picker-list">
              <li className="giphy-container-picker-list-no-item">No GIF found</li>
            </ul>
          )}
        </div>
      </div>
    </>
  );
};
export default Giphy;
